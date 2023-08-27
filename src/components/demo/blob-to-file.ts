export function blobToFile(blob: Blob, fileName: string): File {
  return new File(
    [blob],
    fileName,
    {
      lastModified: new Date().getTime(), // lastModified is the current time, which is the same as the file downloaded to the disk using web browsers.
      type: blob.type
    }
  )
}
