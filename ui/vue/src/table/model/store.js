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

    _fetchSize(idx = 0) {
        const size = this._indices[idx];
        return size !== undefined ? size : this._defaultSize;
    }

    _findIndex(offset = 0, type = true) {
        let idx = 0;
        let offsetSize = 0;
        while (offsetSize < offset && idx < this._length) {
            console.log(this._fetchSize(idx))
            offsetSize += type ? this._fetchSize(idx) : this._defaultSize
            idx += 1;
        }

        return clamp(idx, 0, this._length - 1);
    }

    _maxScrollIndex() {
        let width = 0;
        let maxScrollIndex = this._length;
        while (width < this._viewportSize && maxScrollIndex >= 0) {
            width += this._fetchSize(maxScrollIndex);
            maxScrollIndex--;
        }

        return Math.min(this._length - 1, maxScrollIndex + 1);
    }

    getRange() {
        const startIndex = this._findIndex(this._offsetSize, false);

        return [startIndex, this._findIndex(this._viewportSize + this._offsetSize)];
    }

    getSizes() {
        const maxScrollIndex = this._maxScrollIndex();


        return maxScrollIndex * this._defaultSize + this._viewportSize
    }

    update(type, payload) {
        switch (type) {
            case ACTION_ITEM_RESIZE: {
                const [idx, size] = payload
                this._indices[idx] = size
                break;
            }

            case ACTION_VIEWPORT_RESIZE: {
                this._viewportSize = payload
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