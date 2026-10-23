import { AnalyticsBackendEvent } from './backend-event';
import { MAX_KEPT_EVENTS, UnsentEvents } from './unsent-events';

function event(id: string): AnalyticsBackendEvent {
  return {
    event_id: id, user_id: 'u', session_id: 's', seq: 0, client_ts: '2026-10-24T00:00:00.000Z',
    app_version: 'abc', os: 'macos', os_release: '10.15.7', category: 'Test', action: 'Test', label: null, value: null,
  };
}

describe('UnsentEvents', () => {
  afterEach(() => localStorage.clear());

  it('keeps events for the next page load, which takes them once', () => {
    new UnsentEvents(localStorage).save([event('a'), event('b')]);
    const next = new UnsentEvents(localStorage);
    expect(next.loadAndRemove().map((e) => e.event_id)).toEqual(['a', 'b']);
    expect(next.loadAndRemove()).toEqual([]);
  });

  it('keeps the newest when there are too many', () => {
    const many = Array.from({ length: MAX_KEPT_EVENTS + 5 }, (_, i) => event(`e${i}`));
    new UnsentEvents(localStorage).save(many);
    const kept = new UnsentEvents(localStorage).loadAndRemove();
    expect(kept.length).toBe(MAX_KEPT_EVENTS);
    expect(kept[0].event_id).toBe('e5');
  });

  it('removes what it kept, when there is nothing to keep or the page is shown again', () => {
    const unsent = new UnsentEvents(localStorage);
    unsent.save([event('a')]);
    unsent.save([]);
    expect(unsent.loadAndRemove()).toEqual([]);
    unsent.save([event('b')]);
    unsent.remove();
    expect(unsent.loadAndRemove()).toEqual([]);
  });

  it('takes nothing from storage that holds something else', () => {
    localStorage.setItem('AnalyticsUnsentEvents', '{not json');
    expect(new UnsentEvents(localStorage).loadAndRemove()).toEqual([]);
    localStorage.setItem('AnalyticsUnsentEvents', '{"events":1}');
    expect(new UnsentEvents(localStorage).loadAndRemove()).toEqual([]);
  });
});
