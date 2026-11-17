// What a drag over the page carries, and where it is, for DropPhoto.tsx.

/**
 * Whether what is dragged has files, as a file dragged from the file manager has. Text and links that are dragged
 * have none. While a file is dragged over the page, the browser tells that there are files, and not which: they can
 * be read when they are dropped.
 */
export function isFileDrag(dataTransfer: DataTransfer | null | undefined): boolean {
  return !!dataTransfer && Array.from(dataTransfer.types ?? []).includes('Files');
}

/**
 * The files dropped, in the order that the browser gives them, without the folders. A folder dropped is among the
 * files too, as one that cannot be read; only its item tells that it is a folder.
 */
export function droppedFiles(dataTransfer: DataTransfer | null | undefined): File[] {
  if (!dataTransfer) return [];
  const items = Array.from(dataTransfer.items ?? []).filter((item) => item.kind === 'file');
  if (items.length === 0) return Array.from(dataTransfer.files ?? []);
  return items
    .filter((item) => !item.webkitGetAsEntry?.()?.isDirectory)
    .map((item) => item.getAsFile())
    .filter((file): file is File => !!file);
}

/**
 * Whether a drag is over the page itself, rather than over a dialog or a menu, which lie over the page until they
 * are closed. MUI puts them at the end of the body, outside the element that Next.js renders the app in.
 */
export function isOverPage(target: EventTarget | null): boolean {
  if (!(target instanceof Node)) return false;
  const appRoot = document.getElementById('__next');
  if (!appRoot) return true;
  return (
    appRoot.contains(target) ||
    target === document ||
    target === document.documentElement ||
    target === document.body
  );
}
