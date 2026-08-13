// This file is introduced to handle libheif-js's static typing.
// libheif-js ships type declarations only for the emscripten-generated bindings
// (libheif-js/libheif-wasm/libheif.d.ts), not for the HeifDecoder/HeifImage
// wrapper classes which are the actual API. @types/libheif-js does not exist.
// Only the members used by this app are declared here.

declare module 'libheif-js/wasm-bundle' {
  interface HeifImage {
    get_width(): number;
    get_height(): number;

    // Fills imageData with the decoded pixels. The callback receives the filled
    // imageData on success, or null on failure.
    display(
      imageData: ImageData,
      callback: (imageData: ImageData | null) => void
    ): void;

    // Releases the memory allocated in the wasm heap for this image.
    free(): void;
  }

  interface HeifDecoder {
    // Returns the top-level images in the HEIF file. The primary image is the first one.
    decode(buffer: Uint8Array): HeifImage[];
  }

  interface LibHeif {
    HeifDecoder: new () => HeifDecoder;
  }

  const libheif: LibHeif;
  export default libheif;
}
