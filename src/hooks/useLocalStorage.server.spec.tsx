/**
 * @jest-environment node
 */
import { renderToString } from 'react-dom/server';
import { readStorage, useLocalStorage, writeStorage } from './useLocalStorage';

// Next.js prerenders the pages on Node.js. On Node.js 26, reading its
// localStorage, even with `typeof localStorage`, prints an ExperimentalWarning.
describe('on the server', () => {
  let reads = 0;
  beforeEach(() => {
    reads = 0;
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get: () => {
        reads++;
        return undefined;
      },
    });
  });

  it('renders the default without reading localStorage', () => {
    function DateFormat() {
      return <>{useLocalStorage('DateFormat', 'YYYY-MM-DD')}</>;
    }
    expect(renderToString(<DateFormat />)).toBe('YYYY-MM-DD');
    expect(reads).toBe(0);
  });

  it('reads and writes nothing', () => {
    expect(readStorage('DateFormat')).toBeNull();
    writeStorage('DateFormat', 'DD/MM/YYYY');
    expect(reads).toBe(0);
  });
});
