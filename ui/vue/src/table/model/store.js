import { ACTION_ITEM_RESIZE, ACTION_VIEWPORT_RESIZE, ACTION_ITEMS_LENGTH_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { clamp } from '../utilties/core'

export class Store {
    _indices = []

    _override = []

    _auto = []

    _offset_size = 0

    _viewport_size = 0

    constructor(length = 0, size = 60, virtual = true) {
        this._length = length
        this._default_size = size
        this._virtual = virtual ? true : false
    }

    _fecth_size(idx) {
        const size = this._indices[idx];
        return size !== undefined ? size : this._default_size;
    }

    _find_index(offset = 0) {
        let idx = 0;
        let sizes = 0;

        while (sizes < offset && idx < this._length) {
            idx += 1;
            sizes += this._fecth_size(idx)
        }

        return clamp(idx, 0, this._length - 1);
    }

    _calc_range() {
        const start = this._find_index(this._offset_size)

        return [start, this._find_index(this._offset_size + this._viewport_size)]
    }

    update(type, payload) {
        switch (type) {
            case ACTION_ITEM_RESIZE: {
                const [idx, size] = payload
                this._indices[idx] = size
                break;
            }

            case ACTION_VIEWPORT_RESIZE: {
                this._viewport_size = this._virtual ? payload : Infinity
                break;
            }

            case ACTION_ITEMS_LENGTH_RESIZE: {
                this._length = payload
                break;
            }

            case ACTION_SCROLL: {
                this._offset_size = payload
                break;
            }
        }
    }
}