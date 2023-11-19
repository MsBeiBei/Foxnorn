import { ACTION_ITEM_RESIZE, ACTION_VIEWPORT_RESIZE, ACTION_ITEMS_LENGTH_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { clamp } from '../utilties/core'

export class Store {
    _indices = []

    _override = []

    _auto = []

    _offsetSize = 0

    _viewportSize = 0

    constructor(length = 0, size = 60, virtual = true) {
        this._length = length
        this._defaultSize = size
        this._isVirtual = virtual ? true : false
    }

    _getSize(idx = 0) {
        const size = this._indices[idx];
        return size !== undefined ? size : this._defaultSize;
    }

    _findIndex(offset = 0) {
        let idx = 0;
        let sizes = 0;
        while (sizes < offset && idx < this._length) {
            idx += 1;
            sizes += this._getSize(idx)
        }

        return clamp(idx, 0, this._length - 1);
    }

    _getSizes() {
        return this._length * this._getSize(0)
    }

    getRange() {
        const start = this._findIndex(this._offsetSize)
        return [start, this._findIndex(this._offsetSize + this._viewportSize)]
    }

    update(type, payload) {
        switch (type) {
            case ACTION_ITEM_RESIZE: {
                const [idx, size] = payload
                this._indices[idx] = size
                break;
            }

            case ACTION_VIEWPORT_RESIZE: {
                this._viewportSize = this._isVirtual ? payload : Infinity
                break;
            }

            case ACTION_ITEMS_LENGTH_RESIZE: {
                this._length = payload
                break;
            }

            case ACTION_SCROLL: {
                this._offsetSize = payload
                break;
            }
        }
    }
}