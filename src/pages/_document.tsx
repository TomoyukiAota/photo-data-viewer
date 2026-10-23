import { Html, Head, Main, NextScript } from 'next/document';
import { GA_DISABLE_PROPERTY, GA_ID, GA_ID_EXISTS, GTAG_SRC } from '../analytics/ga4';
import { UserSettingKey } from '../utils/user-settings';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
        />
        <link
          rel='stylesheet'
          href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
          integrity='sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
          crossOrigin=''
        />
        {/* Google Analytics. When usage data is turned off in Settings (src/analytics/opt-out.ts),
            gtag.js is not loaded and not configured, and the property it reads to send nothing is
            set as well. Turning it on again does what the first branch does (setDisabled in ga4.ts). */}
        {GA_ID_EXISTS && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                var sendUsageData = true;
                try {
                  sendUsageData = localStorage.getItem('${UserSettingKey.SendUsageData}') !== 'false';
                } catch (e) {}
                if (sendUsageData) {
                  var gtagScript = document.createElement('script');
                  gtagScript.async = true;
                  gtagScript.src = '${GTAG_SRC}';
                  document.head.appendChild(gtagScript);
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                } else {
                  window['${GA_DISABLE_PROPERTY}'] = true;
                }`,
            }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
