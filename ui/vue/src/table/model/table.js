import { useStoreEffect } from '../hooks/useStoreEffect'

export class Table {
    constructor() {
        this._hs = useStoreEffect()
        this._ws = useStoreEffect()
    }

    getVirtualWidth() {
        return 600
    }

    getVirtualHeight() {
        return 600
    }

}