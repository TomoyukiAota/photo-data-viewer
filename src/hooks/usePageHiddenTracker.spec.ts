import { createVisibleTime } from './usePageHiddenTracker';

describe('createVisibleTime', () => {
  it('counts a page visible from the start since it was loaded', () => {
    const visibleTime = createVisibleTime(true);
    expect(visibleTime.hidden(5000)).toBe(5000);
  });

  it('counts only the time it was shown', () => {
    const visibleTime = createVisibleTime(true);
    visibleTime.hidden(5000);
    visibleTime.shown(60000);
    expect(visibleTime.hidden(70000)).toBe(15000);
  });

  it('counts nothing for a page opened in the background until it is shown', () => {
    const visibleTime = createVisibleTime(false);
    expect(visibleTime.hidden(5000)).toBe(0);
    visibleTime.shown(8000);
    expect(visibleTime.hidden(10000)).toBe(2000);
  });

  it('is not thrown off by being hidden twice', () => {
    const visibleTime = createVisibleTime(true);
    visibleTime.hidden(1000);
    expect(visibleTime.hidden(9000)).toBe(1000);
  });
});
