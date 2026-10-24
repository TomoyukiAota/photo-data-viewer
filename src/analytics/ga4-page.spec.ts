import { ga4PageFields } from './ga4-page';

describe('ga4PageFields', () => {
  it("leaves the photo's path out of the address, keeping any other parameter", () => {
    expect(ga4PageFields('https://pdv-in-plm.vercel.app/?photoPath=C%3A%5CUsers%5Csomeone%5CPictures%5Ca.jpg').page_location)
      .toBe('https://pdv-in-plm.vercel.app/');
    expect(ga4PageFields('https://photo-data-viewer.vercel.app/?utm_source=github&photoPath=%2Ftmp%2Fa.jpg').page_location)
      .toBe('https://photo-data-viewer.vercel.app/?utm_source=github');
    expect(ga4PageFields('https://photo-data-viewer.vercel.app/about').page_location)
      .toBe('https://photo-data-viewer.vercel.app/about');
  });

  it("gives each page its own title, never the photo's file name", () => {
    expect(ga4PageFields('https://photo-data-viewer.vercel.app/?photoPath=%2Ftmp%2Fa.jpg').page_title).toBe('Photo Data Viewer');
    expect(ga4PageFields('https://photo-data-viewer.vercel.app/settings').page_title).toBe('Settings - Photo Data Viewer');
    expect(ga4PageFields('https://photo-data-viewer.vercel.app/somewhere-else').page_title).toBe('Photo Data Viewer');
  });
});
