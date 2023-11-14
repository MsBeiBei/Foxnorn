import { IS_BROWSER } from './constants'
import { once } from './core'

export const computeStyle = (e) => window.getComputedStyle(e);

export const getStyleNumber = (px) => px ? parseFloat(px) : 0

export const getDocumentRoot = () => document.documentElement;

export const isRTLDocument = once(() => {
    return IS_BROWSER
        ? computeStyle(getDocumentRoot()).direction === "rtl"
        : false;
});