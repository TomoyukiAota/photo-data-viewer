import { beforeSendToVercel } from './vercel-analytics';

describe('beforeSendToVercel', () => {
  afterEach(() => localStorage.clear());

  it('gives the event as it is', () => {
    const event = {
      type: 'pageview',
      url: 'https://photo-data-viewer.vercel.app/about',
    } as const;
    expect(beforeSendToVercel(event)).toEqual(event);
  });

  it("takes the photo's path out of the address, and keeps the rest of the event", () => {
    expect(
      beforeSendToVercel({
        type: 'vital',
        url: 'https://photo-data-viewer.vercel.app/?photoPath=%2FUsers%2Fme%2Fphoto.jpg&utm_source=example',
        route: '/',
      }),
    ).toEqual({
      type: 'vital',
      url: 'https://photo-data-viewer.vercel.app/?utm_source=example',
      route: '/',
    });
    expect(
      beforeSendToVercel({
        type: 'pageview',
        url: 'https://photo-data-viewer.vercel.app/?photoPath=C%3A%5Cphoto.jpg',
      }),
    ).toEqual({
      type: 'pageview',
      url: 'https://photo-data-viewer.vercel.app/',
    });
  });

  it('sends nothing while usage data is turned off', () => {
    localStorage.setItem('SendUsageData', 'false');
    expect(
      beforeSendToVercel({
        type: 'pageview',
        url: 'https://photo-data-viewer.vercel.app/',
      }),
    ).toBeNull();
    expect(
      beforeSendToVercel({
        type: 'vital',
        url: 'https://photo-data-viewer.vercel.app/',
      }),
    ).toBeNull();
  });

  it('sends nothing for an address that cannot be read', () => {
    expect(
      beforeSendToVercel({ type: 'pageview', url: 'not an address' }),
    ).toBeNull();
  });
});
