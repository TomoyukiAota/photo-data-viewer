import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { trackOpenedDropPhotoDialog } from '../../analytics/track-event';
import { AppIntegration } from '../../app-integration/app-integration';
import DialogProvider from '../../context/dialog/DialogProvider';
import PhotoContext from '../../context/photo/photo-context';
import DropPhotoDialog from '../dialog/DropPhotoDialog';
import DropPhoto from './DropPhoto';

jest.mock('../../analytics/track-event');

const mockRouter = { pathname: '/', push: jest.fn(async () => true) };
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));

const loadPhoto = jest.fn();

const VEIL_TEXT = 'Drop the photo here to select it.';
const QUESTION = 'Are you sure you want to select this photo?';

/** The app's part that takes a drop: the page, in the element that Next.js renders the app in, and the dialog. */
function renderApp() {
  const appRoot = document.createElement('div');
  appRoot.id = '__next';
  document.body.appendChild(appRoot);
  render(
    <DialogProvider>
      <PhotoContext.Provider
        value={{ loadedPhotoData: null, loadedPhotoImage: <div />, loadPhoto, reloadPhoto: jest.fn() }}
      >
        <p>The page</p>
        <p>More of the page</p>
        <DropPhotoDialog />
        <DropPhoto />
      </PhotoContext.Provider>
    </DialogProvider>,
    { container: appRoot },
  );
}

/** What a browser gives with a drag: the files, the folders, or text. */
function dataTransfer(content: { files?: string[]; folders?: string[]; text?: string }) {
  const items = [
    ...(content.folders ?? []).map((name) => ({ name, isDirectory: true })),
    ...(content.files ?? []).map((name) => ({ name, isDirectory: false })),
  ].map(({ name, isDirectory }) => {
    const file = new File(['x'], name, { type: isDirectory ? '' : 'image/jpeg' });
    return { kind: 'file', getAsFile: () => file, webkitGetAsEntry: () => ({ isDirectory }) };
  });
  return {
    types: content.text ? ['text/plain', 'text/uri-list'] : ['Files'],
    items,
    files: items.map((item) => item.getAsFile()),
    dropEffect: 'none',
  };
}
type Transfer = ReturnType<typeof dataTransfer>;

/** Dispatches a drag event at `target`, as the browser does. jsdom has no DragEvent, so it is an event with what it carries. */
function drag(target: EventTarget, type: string, transfer?: Transfer) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: transfer ?? null });
  act(() => {
    target.dispatchEvent(event);
  });
  return event;
}

/** A file dragged from outside onto the page and dropped there. */
function dropOnPage(transfer: Transfer) {
  const page = screen.getByText('The page');
  drag(page, 'dragenter', transfer);
  drag(page, 'dragover', transfer);
  return drag(page, 'drop', transfer);
}

const veil = () => screen.queryByText(VEIL_TEXT);

/** The name of the file that the dialog asks about: its description, which a screen reader says after its title. */
function askedAbout(element: HTMLElement | null) {
  const id = element?.getAttribute('aria-describedby');
  return id ? document.getElementById(id)?.textContent : undefined;
}
const dialog = () => screen.queryByRole('dialog', { name: QUESTION });

beforeEach(() => {
  mockRouter.pathname = '/';
  jest.clearAllMocks();
});

it('shows that the page takes a file dragged over it, until the file leaves the window', () => {
  renderApp();
  const transfer = dataTransfer({ files: ['demo.jpg'] });
  const [page, more] = [screen.getByText('The page'), screen.getByText('More of the page')];

  const entered = drag(page, 'dragenter', transfer);
  expect(entered.defaultPrevented).toBe(true); // The browser does not open the file.
  expect(veil()).not.toBeNull();
  const over = drag(page, 'dragover', transfer);
  expect(over.defaultPrevented).toBe(true);
  expect(transfer.dropEffect).toBe('copy');

  // From one element to another: the next is entered before the first is left.
  drag(more, 'dragenter', transfer);
  drag(page, 'dragleave', transfer);
  expect(veil()).not.toBeNull();

  drag(more, 'dragleave', transfer);
  expect(veil()).toBeNull();
});

it('asks before a dropped photo is selected, and selects it with Select, which has the focus', async () => {
  renderApp();
  const dropped = dropOnPage(dataTransfer({ files: ['demo.jpg'] }));
  expect(dropped.defaultPrevented).toBe(true);
  expect(veil()).toBeNull();

  expect(dialog()).not.toBeNull();
  expect(askedAbout(dialog())).toBe('demo.jpg');
  const select = screen.getByRole('button', { name: 'Select' });
  expect(document.activeElement).toBe(select);
  expect(trackOpenedDropPhotoDialog).toHaveBeenCalledWith(1);
  expect(loadPhoto).not.toHaveBeenCalled();

  fireEvent.click(select);
  await waitFor(() => expect(loadPhoto).toHaveBeenCalledTimes(1));
  expect(loadPhoto).toHaveBeenCalledWith(expect.objectContaining({ name: 'demo.jpg' }), { isDropped: true });
  expect(mockRouter.push).not.toHaveBeenCalled();
  await waitFor(() => expect(dialog()).toBeNull());
});

it('selects nothing when it is cancelled, by its button, by Escape or by a click outside it', async () => {
  renderApp();
  const cancels = [
    () => fireEvent.click(screen.getByRole('button', { name: 'Cancel' })),
    () => fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' }),
    () => fireEvent.click(document.querySelector('.MuiBackdrop-root') as Element),
  ];
  for (const cancel of cancels) {
    dropOnPage(dataTransfer({ files: ['demo.jpg'] }));
    expect(dialog()).not.toBeNull();
    cancel();
    await waitFor(() => expect(dialog()).toBeNull());
  }
  expect(trackOpenedDropPhotoDialog).toHaveBeenCalledTimes(3);
  expect(loadPhoto).not.toHaveBeenCalled();
});

it('opens the Home page first when the photo is selected on another page', async () => {
  mockRouter.pathname = '/settings';
  renderApp();
  dropOnPage(dataTransfer({ files: ['demo.jpg'] }));
  fireEvent.click(screen.getByRole('button', { name: 'Select' }));
  await waitFor(() => expect(loadPhoto).toHaveBeenCalledTimes(1));
  expect(mockRouter.push).toHaveBeenCalledWith('/');
  expect(mockRouter.push.mock.invocationCallOrder[0]).toBeLessThan(loadPhoto.mock.invocationCallOrder[0]);
});

it('asks about the first of several files, and passes over folders', () => {
  renderApp();
  dropOnPage(dataTransfer({ folders: ['Holiday'], files: ['b.jpg', 'a.jpg'] }));
  expect(askedAbout(dialog())).toBe('b.jpg');
  expect(trackOpenedDropPhotoDialog).toHaveBeenCalledWith(2);
});

it('does nothing with folders alone, but keeps the browser from opening them', () => {
  renderApp();
  const dropped = dropOnPage(dataTransfer({ folders: ['Holiday'] }));
  expect(dropped.defaultPrevented).toBe(true);
  expect(screen.queryByRole('dialog')).toBeNull();
  expect(veil()).toBeNull();
});

it('leaves text and links that are dragged to the browser', () => {
  renderApp();
  const dropped = dropOnPage(dataTransfer({ text: 'https://example.com/' }));
  expect(dropped.defaultPrevented).toBe(false);
  expect(veil()).toBeNull();
  expect(screen.queryByRole('dialog')).toBeNull();
});

it('leaves a drag that starts in the page to the browser, such as the photo dragged by the mouse', () => {
  renderApp();
  const page = screen.getByText('The page');
  const transfer = dataTransfer({ files: ['photo.jpg'] });
  drag(page, 'dragstart', transfer);
  expect(drag(page, 'dragover', transfer).defaultPrevented).toBe(false);
  expect(veil()).toBeNull();
  expect(drag(page, 'drop', transfer).defaultPrevented).toBe(false);
  drag(page, 'dragend', transfer);
  expect(screen.queryByRole('dialog')).toBeNull();

  // A file from outside, after it, is taken again.
  dropOnPage(dataTransfer({ files: ['demo.jpg'] }));
  expect(dialog()).not.toBeNull();
});

it('refuses a file dropped on an open dialog, and keeps the browser from opening it', () => {
  renderApp();
  dropOnPage(dataTransfer({ files: ['a.jpg'] }));
  const open = screen.getByRole('dialog');

  // The dialog is outside the app's element, as MUI puts it at the end of the body.
  const transfer = dataTransfer({ files: ['b.jpg'] });
  expect(drag(open, 'dragenter', transfer).defaultPrevented).toBe(true);
  expect(drag(open, 'dragover', transfer).defaultPrevented).toBe(true);
  expect(transfer.dropEffect).toBe('none');
  expect(veil()).toBeNull();
  expect(drag(open, 'drop', transfer).defaultPrevented).toBe(true);

  expect(askedAbout(screen.getByRole('dialog'))).toBe('a.jpg');
  expect(trackOpenedDropPhotoDialog).toHaveBeenCalledTimes(1);
});

it('hides the veil at a move of the mouse, which comes only when no file is dragged over the page', () => {
  renderApp();
  drag(screen.getByText('The page'), 'dragenter', dataTransfer({ files: ['demo.jpg'] }));
  expect(veil()).not.toBeNull();
  act(() => {
    fireEvent.mouseMove(screen.getByText('The page'));
  });
  expect(veil()).toBeNull();
});

describe('in Photo Location Map', () => {
  beforeEach(() => {
    jest.spyOn(AppIntegration, 'isStandalone', 'get').mockReturnValue(false);
  });
  afterEach(() => jest.restoreAllMocks());

  it('listens for nothing, so that its window does with a dropped file what it did before', () => {
    renderApp();
    const page = screen.getByText('The page');
    const transfer = dataTransfer({ files: ['demo.jpg'] });
    expect(drag(page, 'dragenter', transfer).defaultPrevented).toBe(false);
    expect(drag(page, 'dragover', transfer).defaultPrevented).toBe(false);
    expect(veil()).toBeNull();
    expect(drag(page, 'drop', transfer).defaultPrevented).toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
