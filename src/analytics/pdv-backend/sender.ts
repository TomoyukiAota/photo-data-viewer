// Copied and modified from https://github.com/TomoyukiAota/photo-location-map/blob/master/src-shared/analytics/analytics-backend/analytics-backend-sender.ts
// Modified: batches are kept under 60 KiB, for fetch's keepalive (see below); sendNow
// sends at once, for when the page is hidden; sizes are counted without TextEncoder,
// which Jest's environment here lacks.

import { AnalyticsBackendEvent } from './backend-event';

export interface AnalyticsBackendSenderOptions {
  /** Sends one batch. Resolves with the HTTP status; rejects when the request fails (e.g. offline). */
  post: (events: AnalyticsBackendEvent[]) => Promise<number>;
  setTimer: (callback: () => void, delayMs: number) => unknown;
  clearTimer: (timer: unknown) => void;
  logger: { info: (message: string) => void; warn: (message: string) => void };
}

// Decides when to send events to the analytics backend:
//  - 1 second after the first unsent event, with everything queued by then. The events of a page load are
//    produced within a fraction of a second, so they go in one request.
//  - At once when a full batch (500 events, the most the backend takes in one request) is queued.
//  - A batch is also kept under 60 KiB: a request sent with fetch's keepalive, which outlives the page, may carry
//    at most 64 KiB, counted over all such requests in flight. When a batch is cut short by either limit, the next
//    is sent right after it.
//  - After a network error, 429 or 5xx, the batch is retried with exponential backoff from 5 seconds up to
//    5 minutes, so that a browser offline does not retry every second.
//  - Any other 4xx would fail again, so that batch is dropped.
// Timers and the request itself are passed in, so that this logic can be unit-tested.
export class AnalyticsBackendSender {
  public static readonly sendDelayMs = 1_000;
  public static readonly maxBatchSize = 500;
  public static readonly maxBatchBytes = 60 * 1024; // Of the events' JSON; keepalive allows 64 KiB.
  public static readonly maxQueueSize = 5_000; // Keeps memory bounded while offline; the oldest events are dropped.
  public static readonly initialRetryDelayMs = 5_000;
  public static readonly maxRetryDelayMs = 300_000;

  private queue: AnalyticsBackendEvent[] = [];
  private inFlight: AnalyticsBackendEvent[] = [];
  private timer: unknown = undefined;
  private retryDelayMs = 0; // 0 unless the last attempt failed and a retry is scheduled.

  constructor(private readonly options: AnalyticsBackendSenderOptions) {}

  public add(...events: AnalyticsBackendEvent[]): void {
    this.queue.push(...events);
    const excess = this.queue.length - AnalyticsBackendSender.maxQueueSize;
    if (excess > 0) {
      this.queue.splice(0, excess);
      this.options.logger.warn(`The queue is full. Dropped the oldest ${excess} events.`);
    }
    this.scheduleSend();
  }

  /** Everything not sent yet, oldest first, including a batch whose request has not finished. Kept when the page is hidden. */
  public get unsentEvents(): AnalyticsBackendEvent[] {
    return [...this.inFlight, ...this.queue];
  }

  /** Sends what is queued without waiting for the timer, as the page may be about to close. Not while backing off. */
  public sendNow(): void {
    if (this.inFlight.length > 0 || this.retryDelayMs > 0 || this.queue.length === 0) return;
    this.cancelTimer();
    void this.send();
  }

  private scheduleSend(): void {
    // While a request is in flight, send() schedules the next one when it finishes.
    // While backing off, the retry timer sends.
    if (this.inFlight.length > 0 || this.retryDelayMs > 0 || this.queue.length === 0) return;

    if (this.queue.length >= AnalyticsBackendSender.maxBatchSize) {
      this.cancelTimer();
      void this.send();
      return;
    }

    if (this.timer === undefined) this.startTimer(AnalyticsBackendSender.sendDelayMs);
  }

  private startTimer(delayMs: number): void {
    this.timer = this.options.setTimer(() => {
      this.timer = undefined;
      void this.send();
    }, delayMs);
  }

  private cancelTimer(): void {
    if (this.timer !== undefined) {
      this.options.clearTimer(this.timer);
      this.timer = undefined;
    }
  }

  private async send(): Promise<void> {
    if (this.inFlight.length > 0 || this.queue.length === 0) return;

    const batch = this.takeBatch();
    const isCutShort = this.queue.length > 0;
    this.inFlight = batch;
    let retry: boolean;
    try {
      const status = await this.options.post(batch);
      if (status >= 200 && status < 300) {
        retry = false;
      } else if (status === 429 || status >= 500) {
        retry = true;
        this.options.logger.warn(`Sending ${batch.length} events failed with ${status}.`);
      } else {
        retry = false;
        this.options.logger.warn(`Sending ${batch.length} events failed with ${status}. Dropped them, as they would fail again.`);
      }
    } catch (error) {
      retry = true;
      this.options.logger.warn(`Sending ${batch.length} events failed: ${error}`);
    }
    this.inFlight = [];

    if (retry) {
      this.queue.unshift(...batch);
      this.retryDelayMs =
        this.retryDelayMs === 0
          ? AnalyticsBackendSender.initialRetryDelayMs
          : Math.min(this.retryDelayMs * 2, AnalyticsBackendSender.maxRetryDelayMs);
      this.options.logger.warn(`Retrying in ${this.retryDelayMs / 1000} seconds.`);
      this.cancelTimer();
      this.startTimer(this.retryDelayMs);
      return;
    }

    this.retryDelayMs = 0;
    if (isCutShort) void this.send();
    else this.scheduleSend(); // Events added while the request was in flight.
  }

  /** Takes the oldest events, up to maxBatchSize events and maxBatchBytes, but always at least one. */
  private takeBatch(): AnalyticsBackendEvent[] {
    let count = 0;
    let bytes = 0;
    for (const event of this.queue) {
      const eventBytes = utf8Length(JSON.stringify(event)) + 1; // With the comma between events.
      if (count === AnalyticsBackendSender.maxBatchSize || (count > 0 && bytes + eventBytes > AnalyticsBackendSender.maxBatchBytes)) break;
      count++;
      bytes += eventBytes;
    }
    return this.queue.splice(0, count);
  }
}

/** The bytes a string takes in UTF-8, counted by UTF-16 unit so that it does not depend on how strings iterate. */
export function utf8Length(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const unit = text.charCodeAt(i);
    if (unit < 0x80) {
      bytes += 1;
    } else if (unit < 0x800) {
      bytes += 2;
    } else if (unit >= 0xd800 && unit <= 0xdbff && i + 1 < text.length) {
      bytes += 4; // A pair of UTF-16 units, one character outside the Basic Multilingual Plane.
      i++;
    } else {
      bytes += 3;
    }
  }
  return bytes;
}
