/**
 * @jest-environment node
 */
import { renderToStaticMarkup } from 'react-dom/server';

import SearchHead from './SearchHead';

// As in SearchHead.spec.tsx: the children of next/head, rendered as they are.
jest.mock('next/head', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Next.js prerenders the pages on Node.js when the app is built, with the
// build's environment: `PDV_IN_PLM=True` for the deployment for Photo Location
// Map (npm run build:plm).
describe('when the app is built', () => {
  const original = process.env.PDV_IN_PLM;
  afterEach(() => {
    if (original === undefined) delete process.env.PDV_IN_PLM;
    else process.env.PDV_IN_PLM = original;
  });

  it('serves the standalone app with its title and its description', () => {
    delete process.env.PDV_IN_PLM;
    const head = renderToStaticMarkup(<SearchHead page='/' withTitle />);
    expect(head).toContain('<title>Photo Data Viewer</title>');
    expect(head).toContain(
      '<meta name="description" content="View the EXIF data',
    );
    expect(head).toContain(
      '<link rel="canonical" href="https://photo-data-viewer.vercel.app/"/>',
    );
  });

  it("serves the deployment for Photo Location Map without them, so that its window keeps Photo Location Map's title", () => {
    process.env.PDV_IN_PLM = 'True';
    expect(renderToStaticMarkup(<SearchHead page='/' withTitle />)).toBe('');
  });
});
