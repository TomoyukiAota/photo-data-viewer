import { droppedFiles, isFileDrag, isOverPage } from './drop-photo';

/** An item of what is dropped, as a browser gives a file or a folder. */
function item(name: string, isDirectory = false) {
  const file = new File(['x'], name);
  return { kind: 'file', getAsFile: () => file, webkitGetAsEntry: () => ({ isDirectory }) };
}

function dataTransfer(fields: Partial<Record<'types' | 'items' | 'files', unknown[]>>) {
  return fields as unknown as DataTransfer;
}

describe('isFileDrag', () => {
  it('tells a drag of files from one of text or a link', () => {
    expect(isFileDrag(dataTransfer({ types: ['Files'] }))).toBe(true);
    // Firefox names the files twice.
    expect(isFileDrag(dataTransfer({ types: ['application/x-moz-file', 'Files'] }))).toBe(true);
    expect(isFileDrag(dataTransfer({ types: ['text/plain'] }))).toBe(false);
    expect(isFileDrag(dataTransfer({ types: ['text/uri-list', 'text/html'] }))).toBe(false);
    expect(isFileDrag(null)).toBe(false);
  });
});

describe('droppedFiles', () => {
  it('gives the files in the order of the browser, without the folders', () => {
    const files = droppedFiles(
      dataTransfer({ items: [item('Holiday', true), item('b.jpg'), item('a.jpg')] }),
    );
    expect(files.map((file) => file.name)).toEqual(['b.jpg', 'a.jpg']);
  });

  it('gives nothing for folders alone', () => {
    expect(droppedFiles(dataTransfer({ items: [item('Holiday', true)] }))).toEqual([]);
  });

  it('leaves out what is not a file, such as text dropped with it', () => {
    const text = { kind: 'string', getAsFile: () => null, webkitGetAsEntry: () => null };
    const files = droppedFiles(dataTransfer({ items: [text, item('a.jpg')] }));
    expect(files.map((file) => file.name)).toEqual(['a.jpg']);
  });

  it('takes an item that cannot tell whether it is a folder as a file', () => {
    const file = new File(['x'], 'a.jpg');
    const files = droppedFiles(dataTransfer({ items: [{ kind: 'file', getAsFile: () => file }] }));
    expect(files).toEqual([file]);
  });

  it('gives the files of a browser that has no items', () => {
    const file = new File(['x'], 'a.jpg');
    expect(droppedFiles(dataTransfer({ files: [file] }))).toEqual([file]);
    expect(droppedFiles(null)).toEqual([]);
  });
});

describe('isOverPage', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('tells the page from a dialog or a menu, which lie over it outside the app\'s element', () => {
    document.body.innerHTML = '<div id="__next"><p>Page</p></div><div role="presentation"><div>Dialog</div></div>';
    expect(isOverPage(document.querySelector('p'))).toBe(true);
    expect(isOverPage(document.getElementById('__next'))).toBe(true);
    expect(isOverPage(document.body)).toBe(true);
    expect(isOverPage(document.querySelector('[role=presentation] > div'))).toBe(false);
    expect(isOverPage(window)).toBe(false);
    expect(isOverPage(null)).toBe(false);
  });

  it('takes everything as the page where the app has no element of its own', () => {
    document.body.innerHTML = '<p>Page</p>';
    expect(isOverPage(document.querySelector('p'))).toBe(true);
  });
});
