export class Store {
    _cache_sizes = { auto: [], override: [], indices: [] }

    _viewport_size = 0

    _length = 0

    _virtual = true

    _calc_start_index(offset) {
        const scroll_index_offset = 0;
        let start_index = 0;
        let offset_size = 0;
        let diff = 0;

        while (offset_size < offset) {
            const new_val = this._cache_sizes.indices[start_index + scroll_index_offset]
            diff = this.scrollLeft - offset_size;
            start_index += 1;
            offset_size += new_val !== undefined ? new_val : 60;
        }

        start_index += diff / (this._cache_sizes.indices[start_index + scroll_index_offset - 1] || 60);
        return Math.max(0, start_index - 1);
    }

    _max_scroll_index() {
        let size = 0

        const scroll_index_offset = 0;
        let max_scroll_index = this._length;
        while (size < this._viewport_size && max_scroll_index >= 0) {
            max_scroll_index--;
            size += this._cache_sizes.indices[max_scroll_index + scroll_index_offset] || 60;
        }

        return Math.min(this._length - 1, max_scroll_index + 1);
    }

    _calc_scrollable_size() {
        const scroll_index_offset = 0;
        const max_scroll_index = this._max_scroll_index();

        let idx = scroll_index_offset;
        let virtual_size = 0;

        while (idx < max_scroll_index + scroll_index_offset) {
            virtual_size += this._cache_sizes.indices[idx] || 60;
            idx++;
        }

        return virtual_size;
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

    fetch_visible_range(offset) {
        if (!this._virtual) {
            return { start_index: 0, end_index: Infinity };
        }

        const start_index = this._calc_start_index(offset)
        const vis_items = Math.min(this._length, Math.ceil(this._viewport_size / 60));
        let end_index = start_index + vis_items + 1;
        return { start_index, end_index };
    }
}