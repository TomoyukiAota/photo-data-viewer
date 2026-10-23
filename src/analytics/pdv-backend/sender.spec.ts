// Ported from Photo Location Map's test/src-shared/analytics/analytics-backend-sender.spec.em.main.ts,
// with sendNow and the 60 KiB batches added.

import { AnalyticsBackendEvent } from './backend-event';
import { AnalyticsBackendSender, utf8Length } from './sender';

// Timers that run only when the test advances the clock.
class FakeTimers {
  private now = 0;
  private nextId = 1;
  private timers: { id: number; at: number; callback: () => void }[] = [];

  public setTimer = (callback: () => void, delayMs: number): unknown => {
    const id = this.nextId++;
    this.timers.push({ id, at: this.now + delayMs, callback });
    return id;
  };

  public clearTimer = (timer: unknown): void => {
    this.timers = this.timers.filter((t) => t.id !== timer);
  };

  /** Delays of the pending timers from now, in ms. */
  public get pendingDelays(): number[] {
    return this.timers.map((t) => t.at - this.now);
  }

  public async advance(ms: number): Promise<void> {
    const end = this.now + ms;
    for (;;) {
      const due = this.timers.filter((t) => t.at <= end).sort((a, b) => a.at - b.at)[0];
      if (!due) break;
      this.now = due.at;
      this.timers = this.timers.filter((t) => t !== due);
      due.callback();
      await settle();
    }
    this.now = end;
  }
}

// Lets pending promise callbacks (the fake request) run. Real timers: FakeTimers stands in for the sender's only.
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

// A request that answers with the given statuses in turn (an Error means a failed request), then 200.
class FakeBackend {
  public readonly batches: string[][] = [];

  constructor(private readonly responses: (number | Error)[] = []) {}

  public post = async (events: AnalyticsBackendEvent[]): Promise<number> => {
    this.batches.push(events.map((e) => e.event_id));
    const response = this.responses.length > 0 ? this.responses.shift()! : 200;
    if (response instanceof Error) throw response;
    return response;
  };
}

const silentLogger = { info: () => {}, warn: () => {} };

let eventCount = 0;
function events(count: number, label: string | null = null): AnalyticsBackendEvent[] {
  return Array.from({ length: count }, () => {
    const id = `e${eventCount++}`;
    return {
      event_id: id, user_id: 'u', session_id: 's', seq: 0, client_ts: '2026-10-24T00:00:00.000Z',
      app_version: 'abc', os: 'macos', os_release: '10.15.7', category: 'Test', action: id, label, value: null,
    };
  });
}

function jsonBytes(batch: string[], all: AnalyticsBackendEvent[]): number {
  const ids = new Set(batch);
  return utf8Length(JSON.stringify(all.filter((e) => ids.has(e.event_id))));
}

function createSender(backend: FakeBackend, timers: FakeTimers): AnalyticsBackendSender {
  return new AnalyticsBackendSender({
    post: backend.post, setTimer: timers.setTimer, clearTimer: timers.clearTimer, logger: silentLogger,
  });
}

describe('AnalyticsBackendSender', () => {
  it('sends 1 second after the first event, with everything added by then, in one request', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    const first = events(1);
    sender.add(...first);
    await timers.advance(500);
    const second = events(2);
    sender.add(...second);
    expect(backend.batches).toEqual([]);
    expect(timers.pendingDelays).toEqual([500]); // The later events do not push the send back.

    await timers.advance(500);
    expect(backend.batches).toEqual([[...first, ...second].map((e) => e.event_id)]);
    expect(sender.unsentEvents).toEqual([]);
  });

  // Unlike Photo Location Map's 200 KiB, 60 KiB holds fewer than 500 events of a usual size, so the batches are cut
  // by size here, and the count only decides when to send without waiting.
  it('sends at once when a full batch is queued, and the rest right after it, each batch within both limits', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    const all = events(AnalyticsBackendSender.maxBatchSize + 1);
    sender.add(...all);
    for (let i = 0; i < 5; i++) await settle();
    expect(([] as string[]).concat(...backend.batches)).toEqual(all.map((e) => e.event_id));
    expect(backend.batches.every((b) => b.length <= AnalyticsBackendSender.maxBatchSize)).toBe(true);
    expect(backend.batches.every((b) => jsonBytes(b, all) <= AnalyticsBackendSender.maxBatchBytes)).toBe(true);
    expect(timers.pendingDelays).toEqual([]);
  });

  it('keeps a batch under 60 KiB, for keepalive, and sends the rest right after it', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    // Like a backlog after some time offline: a photo load sends a label of about 1.5 KB.
    const all = events(150, 'x'.repeat(1500));
    sender.add(...all);
    for (let i = 0; i < 5; i++) {
      await timers.advance(1000);
      await settle();
    }

    expect(backend.batches.length).toBeGreaterThanOrEqual(3);
    expect(backend.batches.every((b) => jsonBytes(b, all) <= AnalyticsBackendSender.maxBatchBytes)).toBe(true);
    expect(([] as string[]).concat(...backend.batches)).toEqual(all.map((e) => e.event_id));
    expect(timers.pendingDelays).toEqual([]);
  });

  it('counts the size in UTF-8 bytes', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    // 3 bytes a character: 18 events are about 3 x 60 KiB in UTF-8, though only about 60 KiB in characters.
    const all = events(18, 'あ'.repeat(10000));
    sender.add(...all);
    for (let i = 0; i < 5; i++) {
      await timers.advance(1000);
      await settle();
    }

    expect(backend.batches.length).toBeGreaterThanOrEqual(3);
    expect(backend.batches.every((b) => jsonBytes(b, all) <= AnalyticsBackendSender.maxBatchBytes)).toBe(true);
  });

  it('sends an event larger than a batch on its own', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    const all = [...events(1), ...events(1, 'x'.repeat(AnalyticsBackendSender.maxBatchBytes)), ...events(1)];
    sender.add(...all);
    for (let i = 0; i < 3; i++) {
      await timers.advance(1000);
      await settle();
    }

    expect(backend.batches).toEqual(all.map((e) => [e.event_id]));
  });

  it('sends events added during a request in the next one', async () => {
    let finishFirstRequest: (status: number) => void = () => {};
    const batches: string[][] = [];
    const timers = new FakeTimers();
    const sender = new AnalyticsBackendSender({
      post: async (batch) => {
        batches.push(batch.map((e) => e.event_id));
        return batches.length === 1 ? new Promise<number>((resolve) => (finishFirstRequest = resolve)) : 200;
      },
      setTimer: timers.setTimer, clearTimer: timers.clearTimer, logger: silentLogger,
    });

    const first = events(1);
    sender.add(...first);
    await timers.advance(1000);
    const second = events(1);
    sender.add(...second);
    expect(sender.unsentEvents.map((e) => e.event_id)).toEqual([...first, ...second].map((e) => e.event_id));

    finishFirstRequest(200);
    await settle();
    await timers.advance(1000);
    expect(batches).toEqual([[first[0].event_id], [second[0].event_id]]);
  });

  for (const failure of [new Error('Failed to fetch'), 429, 500, 503]) {
    it(`retries after ${failure instanceof Error ? 'a failed request' : failure}, backing off from 5 seconds up to 5 minutes`, async () => {
      const backend = new FakeBackend(Array(8).fill(failure));
      const timers = new FakeTimers();
      const sender = createSender(backend, timers);

      const batch = events(3);
      sender.add(...batch);
      await timers.advance(1000);
      const delays: number[] = [];
      for (let attempt = 0; attempt < 8; attempt++) {
        delays.push(timers.pendingDelays[0]);
        await timers.advance(timers.pendingDelays[0]);
      }

      expect(delays).toEqual([5000, 10000, 20000, 40000, 80000, 160000, 300000, 300000]);
      expect(backend.batches.length).toBe(9); // The 9th attempt succeeded.
      expect(backend.batches.every((b) => b.join() === batch.map((e) => e.event_id).join())).toBe(true);
      expect(sender.unsentEvents).toEqual([]);
    });
  }

  it('does not send new events while backing off, and starts from 5 seconds again after a success', async () => {
    const backend = new FakeBackend([503, 200, 503]);
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    sender.add(...events(1));
    await timers.advance(1000); // 503
    sender.add(...events(AnalyticsBackendSender.maxBatchSize));
    await settle();
    expect(backend.batches.length).toBe(1); // A full batch waits for the retry too.

    await timers.advance(5000); // 200 for the first 500, then the last one right after it gets 503.
    await settle();
    expect(backend.batches.length).toBe(3);
    expect(timers.pendingDelays).toEqual([5000]);
  });

  it('drops a batch rejected with a 4xx other than 429, and goes on', async () => {
    const backend = new FakeBackend([400]);
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    sender.add(...events(2));
    await timers.advance(1000);
    expect(sender.unsentEvents).toEqual([]);
    expect(timers.pendingDelays).toEqual([]);

    const next = events(1);
    sender.add(...next);
    await timers.advance(1000);
    expect(backend.batches[1]).toEqual([next[0].event_id]);
  });

  it('keeps at most 5,000 events, dropping the oldest', async () => {
    const backend = new FakeBackend([new Error('offline')]);
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    sender.add(...events(1));
    await timers.advance(1000); // Fails; now backing off.
    const many = events(AnalyticsBackendSender.maxQueueSize);
    sender.add(...many);

    expect(sender.unsentEvents.map((e) => e.event_id)).toEqual(many.map((e) => e.event_id));
  });

  it('sends at once on sendNow, without waiting for the timer', async () => {
    const backend = new FakeBackend();
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    const queued = events(2);
    sender.add(...queued);
    sender.sendNow();
    await settle();
    expect(backend.batches).toEqual([queued.map((e) => e.event_id)]);
    expect(timers.pendingDelays).toEqual([]);
  });

  it('does not send on sendNow while backing off', async () => {
    const backend = new FakeBackend([503]);
    const timers = new FakeTimers();
    const sender = createSender(backend, timers);

    sender.add(...events(1));
    await timers.advance(1000); // 503; backing off.
    sender.sendNow();
    await settle();
    expect(backend.batches.length).toBe(1);
  });
});

describe('utf8Length', () => {
  it('counts 1 to 4 bytes a character', () => {
    expect(utf8Length('a')).toBe(1);
    expect(utf8Length('é')).toBe(2);
    expect(utf8Length('あ')).toBe(3);
    expect(utf8Length('📷')).toBe(4);
    expect(utf8Length('a📷あ')).toBe(8);
  });
});
