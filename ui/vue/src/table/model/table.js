import { ACTION_VIEWPORT_RESIZE, ACTION_ITEM_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { Store } from './store'

export class Table {
    constructor({ ncols, nrows }, callback = () => { }) {
        this._ws = new Store(ncols)
        this._hs = new Store(nrows)

        this._callback = callback
    }

    set viewport({ clientWidth, clientHeight }) {
        this._ws.update(ACTION_VIEWPORT_RESIZE, clientWidth)
        this._hs.update(ACTION_VIEWPORT_RESIZE, clientHeight)

        this._callback(this.fetch_range())
    }

    set cell({ ridx, cidx, width, height }) {
        this._ws.update(ACTION_ITEM_RESIZE, [cidx, width])
        this._hs.update(ACTION_ITEM_RESIZE, [ridx, height])

        this._callback(this.fetch_range())
    }

    set offset({ top, left }) {
        this._ws.update(ACTION_SCROLL, left)
        this._hs.update(ACTION_SCROLL, top)

        this._callback(this.fetch_range())
    }

    fetch_range() {
        const range = Object.create(null)

        const [startCol, endCol] = this._ws._calc_range()
        const [startRow, endRow] = this._hs._calc_range()

        range.startCol = startCol
        range.endCol = endCol
        range.startRow = startRow
        range.endRow = endRow

        console.log(this)

        return range
    }
}