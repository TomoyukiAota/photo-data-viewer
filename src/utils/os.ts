// Reference: https://stackoverflow.com/a/9039885/7947548
export function isIos() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

/**
 * Whether this is a Mac, whose file manager is the Finder. An iPad says that it is a Mac as well (see isIos), and is
 * not one.
 */
export function isMac() {
  return navigator.platform.startsWith('Mac') && !isIos();
}
