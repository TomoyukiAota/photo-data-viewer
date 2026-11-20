// TL;DR: A page that cannot load a file of its own build, as happens while its server changes deployments, loads
// itself again: once its load has ended, half a second later, at most 3 times a minute, and only while the app has
// not started, so that nothing the user did is lost. _document.tsx puts this script first in the page's head.
// Details:
// - Each merge to main deploys both deployments anew. For several seconds then, Vercel's server gives the HTML of one
//   deployment and the files under /_next/static/ of the other, which answers 404 for those of the first: their
//   addresses name no deployment, and their names differ between builds. A script is named by its content, the _app
//   script holds the commit that it was built from, and the build manifests are in a folder named after the build.
//   Watched on 2026-11-20, as 46342a9 became the deployment: from 12:31:26.3 to 12:31:34.1 UTC, 10 of 44 page loads
//   got HTML whose _app or main script was answered 404, and the old HTML still came 6.9 seconds after the new one
//   first had. The HTML has an empty root (the app renders nothing until it runs in the browser), so such a page
//   never starts and shows nothing. Loaded again a moment later, it works. Vercel's Skew Protection, which keeps a
//   page on its own deployment by adding ?dpl= to the files' addresses, is not used.
// - The script is part of the HTML, and needs none of the build's files: a page whose scripts are missing runs it
//   all the same. It comes before Next.js' own scripts and stylesheets, and listens, in the capture phase, for their
//   error events, which do not bubble.
// - Only a script or a stylesheet of the page's own origin under /_next/static/ counts. A file of another site (the
//   fonts, the analytics) or of this site outside the build (such as Vercel's /_vercel/ scripts, which other servers
//   do not have) never does, nor does a prefetch or a preload, which only gets a file ready.
// - The page is loaded again only once its load event has fired. Photo Location Map loads the page into its window
//   with loadURL() and waits for that load: a navigation that starts before it ends stops it, loadURL() rejects with
//   ERR_ABORTED, and Photo Location Map reports an unhandled error. Loaded again once its load has ended, the window
//   keeps its photo, which Photo Location Map gives to any page of the viewer's origin in that window.
// - Half a second later, so that whatever waits for the load, such as loadURL(), has been told. That is well within
//   the 2 seconds after which Photo Location Map's e2e suite loads the page itself while files of its build are
//   missing (expectShownInViewer in its test/e2e/regression.spec.mjs). Replayed against the loads watched above, a
//   page opened at any moment of that change, whose loads took 0.3 to 1 second, worked by its third load again at
//   the latest (docs/tasks/20261120_reload-on-missing-build-files).
// - At most 3 times within a minute, counted in the tab's sessionStorage, which a reload keeps: a page whose files are
//   missing for good is loaded 3 times, and then left as it is. Where the storage cannot be used, the page is not
//   loaded again, as the loads could not be counted.
// - Only while the app has not started, that is, while Next.js' root, #__next, is empty: the server sends it empty,
//   and the app renders the page into it once it runs (docs/DEVELOPMENT.md#search-engines). Until then, the user has
//   seen nothing and done nothing, so loading the page again loses nothing. A file that fails later is left as the
//   app handles it. Of the chunks that webpack loads once the app runs: the map's leaves the map at its loading text,
//   as next/dynamic renders that text with the error, and the HEIC decoder's leaves a HEIC as it is, which only
//   Safari shows, with its data. When a page's files fail in a navigation within the app, Next.js loads that page by
//   its address. Loading the page again then would lose a photo that the user opened from their disk, in the
//   standalone deployment, and could stop that navigation. In Photo Location Map's window it would keep the photo,
//   but the script is the same in both deployments, and a page that shows something may already be in use.

/** The most times that the page loads itself again within RELOAD_PERIOD_MS. */
export const MAX_RELOADS = 3;

/** The time within which MAX_RELOADS counts: a minute. */
export const RELOAD_PERIOD_MS = 60_000;

/** How long after its load event, or after the failure if that came later, the page loads itself again. */
export const RELOAD_DELAY_MS = 500;

/** The key in sessionStorage of the times, as numbers of milliseconds, at which the page loaded itself again. */
export const RELOADS_STORAGE_KEY = 'ReloadsForMissingBuildFiles';

/**
 * The script, for the page's head. It is written for any browser and uses no module, as it runs before anything
 * else of the app. It reads `location`, `document`, `sessionStorage` and `addEventListener` as globals, so that a
 * unit test can give its own (reload-for-missing-build-files.spec.ts).
 */
export const reloadForMissingBuildFilesScript = `(function () {
  var buildFiles = location.origin + '/_next/static/';
  var failedFile = '';
  var loaded = document.readyState === 'complete';
  var scheduled = false;

  function hasStarted() {
    var root = document.getElementById('__next');
    return !!root && root.hasChildNodes();
  }

  function fileOf(element) {
    if (!element || !element.tagName) return '';
    if (element.tagName === 'SCRIPT') return element.src || '';
    if (element.tagName === 'LINK' && element.relList.contains('stylesheet')) return element.href || '';
    return '';
  }

  function reload() {
    if (hasStarted()) return;
    var now = Date.now();
    var reloads;
    try {
      reloads = JSON.parse(sessionStorage.getItem(${JSON.stringify(RELOADS_STORAGE_KEY)}) || '[]').filter(function (time) {
        return typeof time === 'number' && time <= now && now - time < ${RELOAD_PERIOD_MS};
      });
      if (reloads.length >= ${MAX_RELOADS}) {
        console.warn('A file of this page\\'s build did not load (' + failedFile + '). The page has loaded itself again ${MAX_RELOADS} times within a minute, so it is left as it is.');
        return;
      }
      reloads.push(now);
      sessionStorage.setItem(${JSON.stringify(RELOADS_STORAGE_KEY)}, JSON.stringify(reloads));
    } catch (error) {
      return;
    }
    console.warn('A file of this page\\'s build did not load (' + failedFile + '). Loading the page again.');
    location.reload();
  }

  function reloadOnceLoaded() {
    if (!failedFile || !loaded || scheduled) return;
    scheduled = true;
    setTimeout(reload, ${RELOAD_DELAY_MS});
  }

  addEventListener('error', function (event) {
    if (failedFile) return;
    var file = fileOf(event.target);
    if (file.indexOf(buildFiles) !== 0) return;
    failedFile = file.slice(location.origin.length);
    reloadOnceLoaded();
  }, true);

  addEventListener('load', function () {
    loaded = true;
    reloadOnceLoaded();
  });
})();`;
