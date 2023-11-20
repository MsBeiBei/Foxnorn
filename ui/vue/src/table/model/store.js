import { ACTION_ITEM_RESIZE, ACTION_VIEWPORT_RESIZE, ACTION_ITEMS_LENGTH, ACTION_SCROLL } from '../utilties/constants'
import { clamp, min } from '../utilties/core'

export class Store {
    _indices = []

    _override = []

    _auto = []

    _offset = 0

    _viewport = 0

    constructor(length = 0, size = 60, virtual = true) {
        this._length = length
        this._size = size
        this._virtual = virtual ? true : false
    }

    getRange() {
        const start = this._findIndex(this._offset);

        return [start, this._findIndex(this._viewport, start)];
    }


    _getSize(idx = 0) {
        const size = this._indices[idx];
        return size !== undefined ? size : this._size;
    }

    _getSizes() {
        let maxScrollIndex = this._getMaxScrollIndex()
        let idx = 0
        let size = 0

        while (idx < maxScrollIndex) {
            size += this._getSize(idx);
            idx++
        }

        return size
    }

    _findIndex(offset = 0, idx = 0) {
        let size = 0;
        let diff = 0

        while (size < offset) {
            diff = offset - size
            size += this._getSize(idx)
            idx += 1;
        }

        idx += diff / this._getSize(idx - 1);
        return clamp(idx - 1, 0, this._length - 1);
    }

    _getMaxScrollIndex() {
        if (!this._length) return 0

        let size = 0
        let maxScrollIndex = this._length;
        while (size < this._viewport) {
            maxScrollIndex--
            size += this._getSize(maxScrollIndex)
        }

        return min(this._length - 1, maxScrollIndex + 1)
    }

    update(type, payload) {
        switch (type) {
            case ACTION_ITEM_RESIZE: {
                const [idx, size] = payload
                this._indices[idx] = size
                break;
            }

            case ACTION_VIEWPORT_RESIZE: {
                this._viewport = payload
                break;
            }

            case ACTION_ITEMS_LENGTH: {
                this._length = payload
                break;
            }

            case ACTION_SCROLL: {
                this._offset = payload
                break;
            }
        }
    }
}