export async function sleep(durationInMilliseconds) {
  await new Promise(resolve => setTimeout(resolve, durationInMilliseconds));
}
