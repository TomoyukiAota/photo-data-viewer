import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import { GA_DISABLE_PROPERTY, GA_ID, GA_ID_EXISTS, GTAG_SRC } from '../analytics/ga4';
import { GA4_FALLBACK_TITLE, GA4_PAGE_TITLES, PHOTO_PATH_PARAM } from '../analytics/ga4-page';
import { LANGUAGE_PREFIX, languageOfLocale } from '../i18n/address';
import { getLanguage } from '../i18n/languages';
import { UserSettingKey } from '../utils/user-settings';

export default function Document({ locale }: DocumentProps) {
  const language = languageOfLocale(locale);
  return (
    // The language of the address, which the page is served in (src/i18n/address.ts),
    // or English for an address without one, until the language is applied in
    // the browser (src/i18n/i18n.ts), which changes these attributes.
    <Html
      lang={language ?? 'en'}
      dir={language ? getLanguage(language).direction : undefined}
    >
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
        />
        {/* The web app manifest, with which Chrome and Edge offer to install the app, which then
            opens in a window of its own; Safari's Add to Dock and Add to Home Screen read it too. The
            icon for iPhone and iPad is apple-touch-icon (docs/tasks/20261118_installable-app). The
            deployment in Photo Location Map, built with PDV_IN_PLM=True, is shown in that
            application's window, and has neither. */}
        {process.env.PDV_IN_PLM !== 'True' && (
          <>
            <link rel='manifest' href='/manifest.webmanifest' />
            <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
          </>
        )}
        {/* Google Analytics. When usage data is turned off in Settings (src/analytics/opt-out.ts),
            gtag.js is not loaded and not configured, and the property it reads to send nothing is
            set as well. Turning it on again does what the first branch does (setDisabled in ga4.ts).
            The address and title given are those of ga4PageFields in ga4-page.ts, without the photo,
            and the title is the page's, whatever the language that its address names. */}
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
                    page_title: ga4Titles[ga4Page.pathname.replace(${LANGUAGE_PREFIX}, '') || '/'] || ${JSON.stringify(GA4_FALLBACK_TITLE)},
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
