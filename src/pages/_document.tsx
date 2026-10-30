import { Html, Head, Main, NextScript } from 'next/document';
import { GA_DISABLE_PROPERTY, GA_ID, GA_ID_EXISTS, GTAG_SRC } from '../analytics/ga4';
import { GA4_FALLBACK_TITLE, GA4_PAGE_TITLES, PHOTO_PATH_PARAM } from '../analytics/ga4-page';
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
          href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          integrity='sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          crossOrigin=''
        />
        {/* Google Analytics. When usage data is turned off in Settings (src/analytics/opt-out.ts),
            gtag.js is not loaded and not configured, and the property it reads to send nothing is
            set as well. Turning it on again does what the first branch does (setDisabled in ga4.ts).
            The address and title given are those of ga4PageFields in ga4-page.ts, without the photo. */}
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
                  var ga4Page = new URL(window.location.href);
                  ga4Page.searchParams.delete('${PHOTO_PATH_PARAM}');
                  var ga4Titles = ${JSON.stringify(GA4_PAGE_TITLES)};
                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                    page_location: ga4Page.toString(),
                    page_title: ga4Titles[ga4Page.pathname] || ${JSON.stringify(GA4_FALLBACK_TITLE)},
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
