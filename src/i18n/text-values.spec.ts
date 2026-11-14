import { valuesIn } from './text-values';

/** A value as a right-to-left language is given it: between U+2068 and U+2069, which are not drawn. */
function isolated(value: string): string {
  return `${String.fromCodePoint(0x2068)}${value}${String.fromCodePoint(0x2069)}`;
}

it('gives the values as they are in a language written from left to right', () => {
  expect(valuesIn('en', { width: 4032, height: 3024 })).toEqual({
    width: 4032,
    height: 3024,
  });
  expect(valuesIn('ja', { language: 'English' })).toEqual({
    language: 'English',
  });
});

it.each(['ar', 'he'])(
  'keeps each value together in %s, which is written from right to left',
  (code) => {
    expect(valuesIn(code, { width: 4032, height: 3024 })).toEqual({
      width: isolated('4032'),
      height: isolated('3024'),
    });
    expect(valuesIn(code, { language: 'English' })).toEqual({
      language: isolated('English'),
    });
  },
);

it('gives the values as they are in a language the app does not have', () => {
  expect(valuesIn('xx', { language: 'English' })).toEqual({
    language: 'English',
  });
});

it('leaves the values it was given as they were', () => {
  const values = { language: 'English' };
  valuesIn('ar', values);
  expect(values).toEqual({ language: 'English' });
});
