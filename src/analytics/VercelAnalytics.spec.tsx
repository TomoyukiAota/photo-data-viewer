import { act, render } from '@testing-library/react';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AppIntegration } from '../app-integration/app-integration';
import { writeStorage } from '../hooks/useLocalStorage';
import { beforeSendToVercel } from './vercel-analytics';
import VercelAnalytics from './VercelAnalytics';

// Vercel's components, which would load Vercel's scripts. What is checked here
// is whether they are rendered, and what they are given.
jest.mock('@vercel/analytics/next', () => ({ Analytics: jest.fn(() => null) }));
jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: jest.fn(() => null),
}));

const mockedAnalytics = jest.mocked(Analytics);
const mockedSpeedInsights = jest.mocked(SpeedInsights);

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

it('renders Web Analytics and Speed Insights in the standalone app, each with beforeSendToVercel', () => {
  render(<VercelAnalytics />);
  expect(mockedAnalytics.mock.calls[0][0]).toEqual({
    beforeSend: beforeSendToVercel,
  });
  expect(mockedSpeedInsights.mock.calls[0][0]).toEqual({
    beforeSend: beforeSendToVercel,
  });
});

it('renders neither while usage data is turned off, and both once it is turned on', () => {
  localStorage.setItem('SendUsageData', 'false');
  render(<VercelAnalytics />);
  expect(mockedAnalytics).not.toHaveBeenCalled();
  expect(mockedSpeedInsights).not.toHaveBeenCalled();

  act(() => writeStorage('SendUsageData', true));
  expect(mockedAnalytics).toHaveBeenCalled();
  expect(mockedSpeedInsights).toHaveBeenCalled();
});

it("renders neither in Photo Location Map's window", () => {
  jest.spyOn(AppIntegration, 'isStandalone', 'get').mockReturnValue(false);
  render(<VercelAnalytics />);
  expect(mockedAnalytics).not.toHaveBeenCalled();
  expect(mockedSpeedInsights).not.toHaveBeenCalled();
});
