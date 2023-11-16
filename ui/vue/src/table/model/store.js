import { ACTION_ITEM_RESIZE, ACTION_VIEWPORT_RESIZE, ACTION_ITEMS_LENGTH_RESIZE, ACTION_SCROLL } from '../utilties/constants'

export class Store {
    _cache_sizes = { auto: [], override: [], indices: [] }

    _viewport_size = 0

    _scroll_offset = 0

    constructor(length = 0, virtual = true) {
        this._length = length
        this._virtual = virtual ? true : false
    }

    _calc_start_index() {
        const scroll_index_offset = 0;
        let start_index = 0;
        let offset_size = 0;
        let diff = 0;

        while (offset_size < this._scroll_offset) {
            const new_val = this._cache_sizes.indices[start_index + scroll_index_offset]
            diff = this._scroll_offset - offset_size;
            start_index += 1;
            offset_size += new_val !== undefined ? new_val : 60;
        }

        start_index += diff / (this._cache_sizes.indices[start_index + scroll_index_offset - 1] || 60);
        return Math.max(0, start_index - 1);
    }



    _calc_scrollable_size() {
        // const scroll_index_offset = 0;
        let virtual_size = this._cache_sizes.indices.reduce((x, y) => x + y, 0);

        virtual_size += (this._length - this._cache_sizes.indices.length) * 60

        return virtual_size;
    }

    update(type, payload) {
        switch (type) {
            case ACTION_ITEM_RESIZE: {
                const [idx, size] = payload
                this._cache_sizes.indices[idx] = size
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
                this._scroll_offset = payload
                break;
            }
        }
    }

    fetch_virtual_size() {
        if (!this._virtual) {
            return this._cache_sizes.indices.reduce((x, y) => x + y, 0)
        }

        const virtual_size = this._calc_scrollable_size();
        if (virtual_size !== 0) {
            return this._viewport_size + virtual_size + 2
        }
        return 1
    }

    fetch_visible_range() {
        if (!this._virtual) {
            return { start_index: 0, end_index: Infinity };
        }

        const start_index = this._calc_start_index()
        const vis_items = Math.min(this._length, Math.ceil(this._viewport_size / 60));
        let end_index = start_index + vis_items + 1;
        return { start_index, end_index };
    }
}