import { applyUsageDataSetting, trackEvent, trackPageView } from './analytics';
import * as ga4 from './ga4';
import { Ga4EventName } from './ga4-event-name';
import { isUsageDataSent } from './opt-out';
import { sendToPlmBackend } from './plm-backend';

jest.mock('./ga4');
jest.mock('./opt-out');
jest.mock('./plm-backend');

const mockedIsUsageDataSent = isUsageDataSent as jest.MockedFunction<typeof isUsageDataSent>;

describe('trackEvent', () => {
  beforeEach(() => mockedIsUsageDataSent.mockReturnValue(true));
  afterEach(() => jest.clearAllMocks());

  it('sends GA4 its own name, with the category, label and value as before, and the extra parameters', () => {
    trackEvent({
      category: 'Opened URL',
      action: '[Home Page] Opened URL for Show in Google Maps',
      label: 'https://maps.google.com/',
      ga4Name: Ga4EventName.OpenedUrl,
      ga4Params: { from: 'Home Page', url_description: 'Show in Google Maps' },
    });
    expect(ga4.event).toHaveBeenCalledWith('opened_url', {
      event_category: 'Opened URL',
      event_label: 'https://maps.google.com/',
      value: '',
      from: 'Home Page',
      url_description: 'Show in Google Maps',
    });
  });

  it('sends Photo Location Map the category and action as this app names them', () => {
    trackEvent({
      category: 'User Setting',
      action: 'Changed User Setting',
      label: 'DateFormat: YYYY/MM/DD',
      value: '1',
      ga4Name: Ga4EventName.ChangedUserSetting,
    });
    expect(sendToPlmBackend).toHaveBeenCalledWith('User Setting', 'Changed User Setting', 'DateFormat: YYYY/MM/DD', '1');
  });

  it('leaves a missing label and value out for Photo Location Map, which stores them as null', () => {
    trackEvent({ category: 'Environment', action: 'App Integration Mode', ga4Name: Ga4EventName.AppIntegrationMode });
    expect(sendToPlmBackend).toHaveBeenCalledWith('Environment', 'App Integration Mode', undefined, undefined);
    expect(ga4.event).toHaveBeenCalledWith('app_integration_mode', { event_category: 'Environment', event_label: '', value: '' });
  });

  it('sends nothing when usage data is turned off', () => {
    mockedIsUsageDataSent.mockReturnValue(false);
    trackEvent({ category: 'Loaded Photo', action: 'Loaded Photo', label: 'x', ga4Name: Ga4EventName.LoadedPhoto });
    trackPageView('/about');
    expect(ga4.event).not.toHaveBeenCalled();
    expect(ga4.pageview).not.toHaveBeenCalled();
    expect(sendToPlmBackend).not.toHaveBeenCalled();
  });
});

describe('trackPageView', () => {
  afterEach(() => jest.clearAllMocks());

  it('sends the page view to GA4', () => {
    mockedIsUsageDataSent.mockReturnValue(true);
    trackPageView('/about');
    expect(ga4.pageview).toHaveBeenCalledWith('/about');
  });
});

describe('applyUsageDataSetting', () => {
  afterEach(() => jest.clearAllMocks());

  it("stops GA4's own events when turned off, and resumes them when turned on", () => {
    applyUsageDataSetting(false);
    expect(ga4.setDisabled).toHaveBeenLastCalledWith(true);
    applyUsageDataSetting(true);
    expect(ga4.setDisabled).toHaveBeenLastCalledWith(false);
  });
});
