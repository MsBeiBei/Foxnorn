import { once } from './core'

export const isBrowser = typeof window !== "undefined";

export const computeStyle = (e) => window.getComputedStyle(e);

export const getStyleNumber = (px) => px ? parseFloat(px) : 0

export const getDocumentRoot = () => document.documentElement;

export const isRTLDocument = once(() => {
    return isBrowser
        ? computeStyle(getDocumentRoot()).direction === "rtl"
        : false;
});