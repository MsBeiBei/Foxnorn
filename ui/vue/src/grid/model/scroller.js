export class VirtualScrollerViewModel {
    constructor() {
        this._viewport_size = { width: 0, height: 0 }
        this._virtual_sizes = { auto: [], overide: [], indices: [] }
    }

    _calc_start_index() {
        let start_index = 0
        let offset_size = 0
        let diff = 0
        while (offset_size < this.scroll_offset) {
            const new_val = this._virtual_sizes.indices[start_index]
            diff = this.scroll_offset - offset_size;
            start_index += 1;
            offset_size += new_val !== undefined ? new_val : 60;
        }

        start_index += diff / (this._virtual_sizes.indices[start_index - 1] || 60);
        return Math.max(0, start_index - 1);
    }

    _calculate_range() {
        const start_index = this._calc_start_index()
        const vis_cols = 12
        let end_index = start_index + vis_cols + 1;
        return { start_index, end_index };
    }

    _max_scroll_index(index) {
        let scroll_size = 0
        let max_scroll_index = index;
        while (scroll_size < this._viewport_size.width && max_scroll_index >= 0) {
            max_scroll_index--;
            scroll_size += this._virtual_sizes.indices[max_scroll_index] || 60
        }

        return Math.min(index - 1, max_scroll_index + 1)
    }

    _calc_scrollable_size(index) {
        const max_scroll_index = this._max_scroll_index(index);
        let idx = 0
        let virtual_size = 0;

        while (idx < max_scroll_index) {
            virtual_size += this._virtual_sizes.indices[idx] || 60;
            idx++;
        }

        return virtual_size
    }

    _update_virtual_panel_size() {

    }
}