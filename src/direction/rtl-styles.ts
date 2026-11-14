import type { EmotionCache } from '@emotion/cache';

// Where the styles for right-to-left languages are kept once they are fetched
// (rtl-cache.ts). Loading a language of that direction fetches them with its
// texts (src/i18n/i18n.ts), so that they are here before the language is shown.

let cache: EmotionCache | undefined;

/** Fetches the styles for right-to-left languages, unless they are here already. */
export async function loadRtlStyles(): Promise<void> {
  cache ??= (await import('./rtl-cache')).default;
}

/** The styles for right-to-left languages, or undefined until they are fetched. */
export function rtlStyles(): EmotionCache | undefined {
  return cache;
}
