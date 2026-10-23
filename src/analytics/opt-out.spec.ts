import { isUsageDataSent } from './opt-out';

describe('isUsageDataSent', () => {
  afterEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('is true in a browser that never saw the setting', () => {
    expect(isUsageDataSent()).toBe(true);
  });

  it('follows the setting', () => {
    localStorage.setItem('SendUsageData', 'false');
    expect(isUsageDataSent()).toBe(false);
    localStorage.setItem('SendUsageData', 'true');
    expect(isUsageDataSent()).toBe(true);
  });

  it('is true when the storage cannot be read', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });
    expect(isUsageDataSent()).toBe(true);
  });
});
