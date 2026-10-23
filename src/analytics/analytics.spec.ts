import { trackEvent } from './analytics';
import * as ga4 from './ga4';
import { sendToPlmBackend } from './plm-backend';

jest.mock('./ga4');
jest.mock('./plm-backend');

describe('trackEvent', () => {
  afterEach(() => jest.clearAllMocks());

  it('sends to every sink with the label and value', () => {
    trackEvent('User Setting', 'Changed User Setting', 'DateFormat: YYYY/MM/DD', '1');
    expect(ga4.event).toHaveBeenCalledWith('User Setting', 'Changed User Setting', 'DateFormat: YYYY/MM/DD', '1');
    expect(sendToPlmBackend).toHaveBeenCalledWith('User Setting', 'Changed User Setting', 'DateFormat: YYYY/MM/DD', '1');
  });

  it('sends GA4 an empty string for a missing label and value, as before', () => {
    trackEvent('Environment', 'App Integration Mode');
    expect(ga4.event).toHaveBeenCalledWith('Environment', 'App Integration Mode', '', '');
  });

  it('leaves a missing label and value out for Photo Location Map, which stores them as null', () => {
    trackEvent('Environment', 'App Integration Mode');
    expect(sendToPlmBackend).toHaveBeenCalledWith('Environment', 'App Integration Mode', undefined, undefined);
  });
});
