import { render, screen } from '@testing-library/react';

import ErrorBoundary from './ErrorBoundary';

function Map({ throws }: { throws: boolean }) {
  if (throws) throw new Error('Invalid LatLng object: (NaNNaN, NaNNaN)');
  return <p>map</p>;
}

describe('ErrorBoundary', () => {
  // React logs each error it catches; that is expected here.
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it('shows the fallback instead of children that threw, and keeps the rest of the page', () => {
    render(
      <div>
        <p>photo</p>
        <ErrorBoundary fallback={<p>The map cannot be shown.</p>}>
          <Map throws />
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('photo')).toBeTruthy();
    expect(screen.getByText('The map cannot be shown.')).toBeTruthy();
    expect(screen.queryByText('map')).toBeNull();
  });

  it('renders the children again when the reset key changes, and not before', () => {
    const boundary = (resetKey: number, throws: boolean) => (
      <ErrorBoundary fallback={<p>fallback</p>} resetKey={resetKey}>
        <Map throws={throws} />
      </ErrorBoundary>
    );
    const { rerender } = render(boundary(1, true));
    expect(screen.getByText('fallback')).toBeTruthy();

    rerender(boundary(1, false));
    expect(screen.getByText('fallback')).toBeTruthy();

    rerender(boundary(2, false));
    expect(screen.getByText('map')).toBeTruthy();
    expect(screen.queryByText('fallback')).toBeNull();
  });
});
