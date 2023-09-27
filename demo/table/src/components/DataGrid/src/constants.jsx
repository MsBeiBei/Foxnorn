export const pager = {
    page: 1,
    size: 10
}

export const estimate = [100, 50]

const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export const BROWSER_MAX_HEIGHT = isFirefox ? 5000000 : 10000000;