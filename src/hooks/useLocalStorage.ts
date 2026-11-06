import { useEffect, useState } from 'react';

// This replaces @rehooks/local-storage and stores values the way it did, so
// that saved settings load unchanged: objects as JSON, and other values as
// plain strings such as `false` and `DD/MM/YYYY`. Code that reads the keys
// directly relies on those strings. Reading parses JSON where it can, and
// returns the string itself otherwise.
//
// Nothing here reads localStorage on the server, where Next.js prerenders the
// pages. Check `typeof window` first: Node.js 26 has a localStorage of its
// own, and reading it, even with `typeof localStorage`, prints an
// ExperimentalWarning.

// The browser fires the `storage` event only in other tabs, so writeStorage
// fires this one for this tab.
const changeEvent = 'local-storage-change';

interface Change {
  key: string;
  value: unknown;
}

function parse(stored: string): unknown {
  try {
    return JSON.parse(stored);
  } catch {
    return stored;
  }
}

// The stored value, or null if there is none or this runs on the server.
export function readStorage(key: string): unknown {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(key);
  return stored === null ? null : parse(stored);
}

// Stores the value and updates every useLocalStorage of the key in this tab.
// On the server, it does nothing.
export function writeStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  const stored =
    typeof value === 'object' ? JSON.stringify(value) : String(value);
  window.localStorage.setItem(key, stored);
  window.dispatchEvent(
    new CustomEvent<Change>(changeEvent, { detail: { key, value } }),
  );
}

// The stored value, or `defaultValue` if there is none. The first render on
// the client reads it, so that a saved value is shown at once; the server
// renders `defaultValue`. If nothing is stored, `defaultValue` is stored on
// mount, unless it is null. The value follows writeStorage calls in this tab,
// and changes made in other tabs.
export function useLocalStorage<T>(key: string, defaultValue: T): T {
  const [value, setValue] = useState(() => readStorage(key) as T | null);

  useEffect(() => {
    const handleChange = (event: Event) => {
      const { detail } = event as CustomEvent<Change>;
      if (detail.key === key) setValue(detail.value as T | null);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      setValue(event.newValue === null ? null : (parse(event.newValue) as T));
    };
    window.addEventListener(changeEvent, handleChange);
    window.addEventListener('storage', handleStorage);
    if (defaultValue !== null && window.localStorage.getItem(key) === null) {
      writeStorage(key, defaultValue);
    }
    return () => {
      window.removeEventListener(changeEvent, handleChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, [key, defaultValue]);

  return value ?? defaultValue;
}
