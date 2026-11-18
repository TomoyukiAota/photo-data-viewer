import { displayMode } from './display-mode';

// jsdom answers no media query: each test gives the page a matchMedia that
// answers the display mode as a browser would.
function answerDisplayMode(mode: string) {
  window.matchMedia = jest.fn(
    (query: string) =>
      ({ matches: query === `(display-mode: ${mode})`, media: query }) as MediaQueryList,
  );
}

describe('displayMode', () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
    delete (navigator as { standalone?: unknown }).standalone;
  });

  it("is standalone in the installed app's window", () => {
    answerDisplayMode('standalone');
    expect(displayMode()).toBe('standalone');
  });

  it('is browser in a tab of the browser', () => {
    answerDisplayMode('browser');
    expect(displayMode()).toBe('browser');
  });

  it("is fullscreen in the browser's full screen", () => {
    answerDisplayMode('fullscreen');
    expect(displayMode()).toBe('fullscreen');
  });

  it('is standalone when Safari says that the page was opened from the Home Screen', () => {
    answerDisplayMode('browser');
    Object.defineProperty(navigator, 'standalone', {
      value: true,
      configurable: true,
    });
    expect(displayMode()).toBe('standalone');
  });

  it('is unknown where no media query is answered', () => {
    expect(displayMode()).toBe('unknown');
  });
});
