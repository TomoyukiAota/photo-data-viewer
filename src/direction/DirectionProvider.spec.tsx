import { useTheme } from '@mui/material/styles';
import { act, render, screen } from '@testing-library/react';
import { useEffect } from 'react';

import { applyLanguage } from '../i18n/i18n';
import DirectionProvider, { useIsRtl } from './DirectionProvider';
import { rtlStyles } from './rtl-styles';

afterEach(() => act(() => applyLanguage('en')));

const mounted = jest.fn();

/** Says the direction that MUI's components are given, and counts how often it is built. */
function Probe() {
  const theme = useTheme();
  const isRtl = useIsRtl();
  useEffect(() => mounted(), []);
  return <div data-testid='probe'>{`${theme.direction} ${isRtl}`}</div>;
}

function renderProbe() {
  mounted.mockClear();
  return render(
    <DirectionProvider>
      <Probe />
    </DirectionProvider>,
  );
}

it("gives MUI's components the direction of a language written from left to right", async () => {
  renderProbe();
  expect(screen.getByTestId('probe').textContent).toBe('ltr false');

  await act(() => applyLanguage('ja'));
  expect(screen.getByTestId('probe').textContent).toBe('ltr false');
});

it.each(['ar', 'he'] as const)(
  "gives MUI's components the direction of %s, which is written from right to left",
  async (code) => {
    renderProbe();
    await act(() => applyLanguage(code));
    expect(screen.getByTestId('probe').textContent).toBe('rtl true');
    expect(document.documentElement.dir).toBe('rtl');

    await act(() => applyLanguage('en'));
    expect(screen.getByTestId('probe').textContent).toBe('ltr false');
    expect(document.documentElement.dir).toBe('ltr');
  },
);

it('has the styles for right-to-left languages by the time such a language is shown', async () => {
  renderProbe();
  await act(() => applyLanguage('ar'));
  expect(rtlStyles()?.key).toBe('muirtl');
});

it('keeps what is inside it when the direction changes, such as the loaded photo', async () => {
  renderProbe();
  await act(() => applyLanguage('ar'));
  await act(() => applyLanguage('en'));
  expect(mounted).toHaveBeenCalledTimes(1);
});
