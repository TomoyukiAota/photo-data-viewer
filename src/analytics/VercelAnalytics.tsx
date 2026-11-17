import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import { AppIntegration } from '../app-integration/app-integration';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  UserSettingDefaultValue,
  UserSettingKey,
} from '../utils/user-settings';
import { beforeSendToVercel } from './vercel-analytics';

// Vercel's Web Analytics, the pages that are opened, and Speed Insights, how
// fast they load and respond, added to _app.tsx as Vercel documents for the
// Pages Router. Each loads a script from this app's own address, which sends
// what it measures there. Web Analytics is enabled in the Vercel project's
// settings (docs/CONTRIBUTING.md). The scripts exist on Vercel only: elsewhere
// `npm start` asks for /_vercel/insights/script.js and
// /_vercel/speed-insights/script.js in vain, and `npm run dev` loads Vercel's
// debug versions, which log to the console and send nothing.
//
// In the standalone app only: in Photo Location Map's window, that application
// records this app's use in its own analytics (plm-backend.ts). And while
// usage data is sent only: with the setting off, the scripts are not loaded,
// as gtag.js is not (_document.tsx); once they are, beforeSendToVercel stops
// what they send.
const VercelAnalytics: React.FC = () => {
  const sendUsageData = useLocalStorage<boolean>(
    UserSettingKey.SendUsageData,
    UserSettingDefaultValue.SendUsageData,
  );
  if (!AppIntegration.isStandalone || !sendUsageData) return null;

  return (
    <>
      <Analytics beforeSend={beforeSendToVercel} />
      <SpeedInsights beforeSend={beforeSendToVercel} />
    </>
  );
};

export default VercelAnalytics;
