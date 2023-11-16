import { ACTION_VIEWPORT_RESIZE, BROWSER_MAX_HEIGHT, ACTION_ITEM_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { Store } from './store'

export class Table {
    constructor(ncols, nrows) {
        this._ws = new Store(ncols)
        this._hs = new Store(nrows)

    }

    get width() {
        return this._ws.fetch_virtual_size()
    }

    get height() {
        return Math.min(BROWSER_MAX_HEIGHT, this._hs.fetch_virtual_size())
    }

    set viewport({ clientWidth, clientHeight }) {
        this._ws.update(ACTION_VIEWPORT_RESIZE, clientWidth)
        this._hs.update(ACTION_VIEWPORT_RESIZE, clientHeight)
    }

    set cell({ ridx, cidx, width, height }) {
        this._ws.update(ACTION_ITEM_RESIZE, [cidx, width])
        this._hs.update(ACTION_ITEM_RESIZE, [ridx, height])

    }

    set offset({ top, left }) {
        this._ws.update(ACTION_SCROLL, left)
        this._hs.update(ACTION_SCROLL, top)
    }

    get range() {
        JSON.stringify(this._ws._indices)
        const { start_index: startCol, end_index: endCol } = this._ws.fetch_visible_range()
        const { start_index: startRow, end_index: endRow } = this._hs.fetch_visible_range()
        return {
            startCol,
            endCol,
            startRow,
            endRow
        }
    }

    fetch_cell_width(cidx) {
        return this._ws._indices[cidx]
    }

    fetch_cell_height(ridx) {
        return this._hs._indices[ridx]
    }
}