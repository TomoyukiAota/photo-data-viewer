import { GA4_RESERVED_PREFIXES, Ga4EventName, isValidGa4Name } from './ga4-event-name';

describe('Ga4EventName', () => {
  const names = Object.values(Ga4EventName);

  it.each(names)('%s obeys GA4\'s rule for names', (name) => {
    expect(isValidGa4Name(name)).toBe(true);
    for (const prefix of GA4_RESERVED_PREFIXES) {
      expect(name.startsWith(prefix)).toBe(false);
    }
  });

  it('gives every kind of event a name of its own', () => {
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('isValidGa4Name', () => {
  it('takes letters, digits and _ after a letter, up to 40 characters', () => {
    expect(isValidGa4Name('loaded_photo')).toBe(true);
    expect(isValidGa4Name('a'.repeat(40))).toBe(true);
  });

  it('refuses what GA4 drops', () => {
    expect(isValidGa4Name('Loaded Photo')).toBe(false);
    expect(isValidGa4Name('[PDV] Loaded Photo')).toBe(false);
    expect(isValidGa4Name('1st_event')).toBe(false);
    expect(isValidGa4Name('_event')).toBe(false);
    expect(isValidGa4Name('a'.repeat(41))).toBe(false);
    expect(isValidGa4Name('')).toBe(false);
  });
});
