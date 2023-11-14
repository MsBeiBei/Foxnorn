export const IS_BROWSER = typeof window !== "undefined";

export const IS_SAFARI = window.safari

export const IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export const DEFAULT_SIZE = 50