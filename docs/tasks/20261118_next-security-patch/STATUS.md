# Next.js security patch: status

Started on 2026-11-18. See the [results](./evidence/RESULTS.md).

## Current state

Done, and checked locally. On 2026-11-18 the owner asked for it to be merged
into `main`, from which Vercel deploys both deployments, and it was merged on
the same day as `629cb90` (#82).

- `next` and `eslint-config-next` are 16.4.6 instead of 16.4.3, pinned and in
  step, as before. 16.4.6 is the latest release of 16.4, and npm's `latest`.
- Next.js 16.4.5 fixed seven moderate advisories, each of which includes
  16.4.3. `npm audit` lists two of them so far,
  [GHSA-mfr8-8qww-v76h](https://github.com/advisories/GHSA-mfr8-8qww-v76h) and
  [GHSA-vc7v-qv4w-wrv8](https://github.com/advisories/GHSA-vc7v-qv4w-wrv8);
  the other five are published in Next.js's repository. Each is about a
  feature that this app does not use, so the app was not exposed in practice:
  the upgrade keeps it off versions with known vulnerabilities.
- Nothing else moves. The lockfile changes the twelve packages of Next.js
  alone, and neither the release notes nor the code of 16.4.4 to 16.4.6
  change anything that this app uses: the Pages Router, its locales and the
  webpack builds.
- When a coding agent ran `next build` or `next dev`, 16.4.3 stopped it once
  to recommend an upgrade
  ([installable app](../20261118_installable-app/evidence/RESULTS.md#next-build-run-by-a-coding-agent)).
  16.4.6 is in no advisory's range, and both builds passed on their first run.
- `npm audit` still lists 52 entries, from three advisories of picomatch, glob
  and minimatch, in the tools for development and in Sass. This setup can take
  no fix that removes one of them yet
  ([results](./evidence/RESULTS.md#npm-audit)).

## Resuming

Once Vercel has deployed `main`, the build logs of both projects,
photo-data-viewer and pdv-in-plm, show `Next.js 16.4.6`.

The Electron integration suite was not run, as it opens windows on this
machine. Firefox and WebKit were not run either.

## Follow-ups

- Run `npm audit` again when picomatch publishes a fix of
  [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), or
  when Jest and `babel-plugin-istanbul` accept a glob and a minimatch that are
  fixed ([results](./evidence/RESULTS.md#npm-audit)).
