import { ACTION_VIEWPORT_RESIZE, BROWSER_MAX_HEIGHT, ACTION_ITEM_RESIZE } from '../utilties/constants'
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

    get range() {
        const { start_index: startCol, end_index: endCol } = this._ws.fetch_visible_range()
        const { start_index: startRow, end_index: endRow } = this._hs.fetch_visible_range()

        return {
            startCol,
            endCol,
            startRow,
            endRow
        }
    }

    set viewport({ clientWidth, clientHeight }) {
        this._ws.update(ACTION_VIEWPORT_RESIZE, clientWidth)
        this._hs.update(ACTION_VIEWPORT_RESIZE, clientHeight)
    }

    set cells({ width, height }) {
        this._ws.update(ACTION_ITEM_RESIZE, width)
        this._hs.update(ACTION_ITEM_RESIZE, height)
    }
}