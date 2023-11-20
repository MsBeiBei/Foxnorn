export const IS_BROWSER = typeof window !== "undefined";

export const IS_SAFARI = window.safari

export const IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export const BROWSER_MAX_HEIGHT = IS_FIREFOX ? 5000000 : 10000000;


export const DEBUG = true;

export const ACTION_ITEM_RESIZE = 0

export const ACTION_VIEWPORT_RESIZE = 1

export const ACTION_ITEMS_LENGTH = 2

export const ACTION_SCROLL = 3