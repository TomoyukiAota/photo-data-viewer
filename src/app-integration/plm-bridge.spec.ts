import {
  isInBridgeWindow,
  PLM_BRIDGE_READY_EVENT,
  PlmBridge,
  plmBridge,
  readPhotoFile,
  whenPlmBridgeReady,
} from './plm-bridge';

type WindowWithBridge = Window & { plmPhotoDataViewer?: unknown };

function bridge(overrides: Partial<PlmBridge> = {}): PlmBridge {
  return {
    version: 1,
    readPhoto: jest.fn(async () => ({
      name: 'a.jpg',
      type: 'image/jpeg',
      bytes: new Uint8Array([1, 2, 3]),
    })),
    trackEvent: jest.fn(),
    ...overrides,
  };
}

function setAddress(search: string) {
  window.history.replaceState(null, '', `/${search}`);
}

describe("The bridge of Photo Location Map's isolated window", () => {
  afterEach(() => {
    delete (window as WindowWithBridge).plmPhotoDataViewer;
    setAddress('');
    jest.useRealTimers();
  });

  it('is there when the window gave it, or when the address says that the window gives one', () => {
    expect(isInBridgeWindow()).toBe(false);
    setAddress('?plmBridge=1&dateFormat=YYYY-MM-DD');
    expect(isInBridgeWindow()).toBe(true);
    setAddress('');
    (window as WindowWithBridge).plmPhotoDataViewer = bridge();
    expect(isInBridgeWindow()).toBe(true);
  });

  it('is used only in the version that this app knows', () => {
    (window as WindowWithBridge).plmPhotoDataViewer = bridge();
    expect(plmBridge()?.version).toBe(1);
    (window as WindowWithBridge).plmPhotoDataViewer = {
      ...bridge(),
      version: 2,
    };
    expect(plmBridge()).toBeNull();
  });

  it('is ready at once when the preload ran first, or when the preload says so', async () => {
    const given = bridge();
    (window as WindowWithBridge).plmPhotoDataViewer = given;
    await expect(whenPlmBridgeReady()).resolves.toBe(given);

    delete (window as WindowWithBridge).plmPhotoDataViewer;
    const waiting = whenPlmBridgeReady();
    (window as WindowWithBridge).plmPhotoDataViewer = given;
    window.dispatchEvent(new Event(PLM_BRIDGE_READY_EVENT));
    await expect(waiting).resolves.toBe(given);
  });

  it('fails when none comes in time, when the preload says so without one, or for a version that this app does not know', async () => {
    jest.useFakeTimers();
    const waiting = whenPlmBridgeReady(1000);
    jest.advanceTimersByTime(1000);
    await expect(waiting).rejects.toThrow('gave no bridge within 1000 ms');

    const saidWithoutOne = whenPlmBridgeReady();
    window.dispatchEvent(new Event(PLM_BRIDGE_READY_EVENT));
    await expect(saidWithoutOne).rejects.toThrow(
      'said that its bridge is ready, but gave none',
    );

    (window as WindowWithBridge).plmPhotoDataViewer = { version: 2 };
    await expect(whenPlmBridgeReady()).rejects.toThrow(
      'of a version that this app does not know',
    );
  });

  it('gives the photo as a File, of its bytes or fetched from its URL, and its name first', async () => {
    const names: string[] = [];
    // jsdom has no fetch, which the bytes do not need.
    const unused = jest.fn() as unknown as typeof fetch;
    const fromBytes = await readPhotoFile(bridge(), unused, (name) =>
      names.push(name),
    );
    expect(unused).not.toHaveBeenCalled();
    expect([fromBytes.name, fromBytes.type, fromBytes.size]).toEqual([
      'a.jpg',
      'image/jpeg',
      3,
    ]);

    const fetchPhoto = jest.fn(
      async () =>
        ({
          ok: true,
          blob: async () => new Blob([new Uint8Array([9, 9])]),
        }) as unknown as Response,
    );
    const fromUrl = await readPhotoFile(
      bridge({
        readPhoto: async () => ({
          name: 'b.heic',
          type: 'image/heic',
          url: 'plm-photo://photo/0123',
        }),
      }),
      fetchPhoto,
      (name) => names.push(name),
    );
    expect(fetchPhoto).toHaveBeenCalledWith('plm-photo://photo/0123', {
      mode: 'cors',
      referrerPolicy: 'origin',
    });
    expect([fromUrl.name, fromUrl.type, fromUrl.size]).toEqual([
      'b.heic',
      'image/heic',
      2,
    ]);
    expect(names).toEqual(['a.jpg', 'b.heic']);
  });

  it('fails when Photo Location Map refuses to give the photo from its URL', async () => {
    const refused = jest.fn(
      async () =>
        ({
          ok: false,
          status: 403,
          blob: async () => new Blob([]),
        }) as unknown as Response,
    );
    await expect(
      readPhotoFile(
        bridge({
          readPhoto: async () => ({
            name: 'b.heic',
            type: 'image/heic',
            url: 'plm-photo://photo/0123',
          }),
        }),
        refused,
      ),
    ).rejects.toThrow('Photo Location Map did not give the photo: 403.');
  });
});
