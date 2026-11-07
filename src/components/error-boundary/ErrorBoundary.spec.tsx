import { render, screen } from '@testing-library/react';

import { recordError } from '../../analytics/record-error';
import ErrorBoundary from './ErrorBoundary';
import PageNotShown from './PageNotShown';

jest.mock('../../analytics/record-error');

const error = new Error('Invalid LatLng object: (NaNNaN, NaNNaN)');

function Map({ throws }: { throws: boolean }) {
  if (throws) throw error;
  return <p>map</p>;
}

describe('ErrorBoundary', () => {
  // React logs each error it catches; that is expected here.
  beforeEach(() => jest.spyOn(console, 'error').mockImplementation(() => {}));
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('shows the fallback instead of children that threw, and keeps the rest of the page', () => {
    render(
      <div>
        <p>photo</p>
        <ErrorBoundary name='map' fallback={<p>The map cannot be shown.</p>}>
          <Map throws />
        </ErrorBoundary>
      </div>
    );
    expect(screen.getByText('photo')).toBeTruthy();
    expect(screen.getByText('The map cannot be shown.')).toBeTruthy();
    expect(screen.queryByText('map')).toBeNull();
  });

  it('records the error with the part of the page and the component stack, as it never reaches the window', () => {
    render(
      <ErrorBoundary name='map' fallback={<p>fallback</p>}>
        <Map throws />
      </ErrorBoundary>
    );
    expect(recordError).toHaveBeenCalledTimes(1);
    expect(recordError).toHaveBeenCalledWith(error, 'render', {
      boundary: 'map',
      componentStack: expect.stringContaining('at ErrorBoundary'),
    });
  });

  it('shows the page\'s fallback, which offers a reload, when the whole page threw', () => {
    render(
      <ErrorBoundary name='page' fallback={<PageNotShown />}>
        <Map throws />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert').textContent).toContain('Something went wrong, and this page cannot be shown.');
    expect(screen.getByRole('button', { name: 'Reload' })).toBeTruthy();
    expect(recordError).toHaveBeenCalledWith(error, 'render', expect.objectContaining({ boundary: 'page' }));
  });

  it('catches an error once when the children throw in the render that changes the reset key', () => {
    const boundary = (resetKey: number, throws: boolean) => (
      <ErrorBoundary name='map' fallback={<p>fallback</p>} resetKey={resetKey}>
        <Map throws={throws} />
      </ErrorBoundary>
    );
    const { rerender } = render(boundary(1, false));
    rerender(boundary(2, true));
    expect(screen.getByText('fallback')).toBeTruthy();
    expect(recordError).toHaveBeenCalledTimes(1);
  });

  it('renders the children again when the reset key changes, and not before', () => {
    const boundary = (resetKey: number, throws: boolean) => (
      <ErrorBoundary name='map' fallback={<p>fallback</p>} resetKey={resetKey}>
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
