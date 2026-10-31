# Regression fixtures

`demo.jpg` is a byte-for-byte copy of this application's existing public demo
photo, owned by the repository author. Source revision:
`2ba9ef57fd580cdabc4b26102098064e0b3c8505` in
[photo-data-viewer-resources](https://github.com/TomoyukiAota/photo-data-viewer-resources).
It is used exclusively as the existing demo's regression input.
The tests also create a synthetic one-pixel PNG and malformed file in memory.
No personal or private photographs are required.

`demo.heic` was generated from `demo.jpg` using macOS `sips -s format heic`.
It exercises the existing libheif WASM conversion using fixed, public image data.
