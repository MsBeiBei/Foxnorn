export const METADATA_MAP = new WeakMap();

const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
export const BROWSER_MAX_HEIGHT = isFirefox ? 5000000 : 10000000;