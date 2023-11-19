import { ACTION_VIEWPORT_RESIZE, ACTION_ITEM_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { Store } from './store'

export class Table {
    constructor({ ncols, nrows }, callback = () => { }) {
        this._ws = new Store(ncols)
        this._hs = new Store(nrows)

        this._range = null
        this._sizes = { width: 0, height: 0 }
        this._callback = callback
    }

    set viewport([width, height]) {
        this._ws.update(ACTION_VIEWPORT_RESIZE, width)
        this._hs.update(ACTION_VIEWPORT_RESIZE, height)

        this._range = this._getRange()
        this._sizes = this._getSizes()

        this._callback(this._range, this._sizes,)
    }


    set cell({ ridx, cidx, width, height }) {
        this._ws.update(ACTION_ITEM_RESIZE, [cidx, width])
        this._hs.update(ACTION_ITEM_RESIZE, [ridx, height])

        this._range = this._getRange()
        this._sizes = this._getSizes()

        this._callback(this._range, this._sizes)
    }

    set offset({ top, left }) {
        this._ws.update(ACTION_SCROLL, left)
        this._hs.update(ACTION_SCROLL, top)

        this._range = this._getRange()
        this._sizes = this._getSizes()

        this._callback(this._range, this._sizes)
    }


    _getRange() {
        const range = Object.create(null)

        const [startCol, endCol] = this._ws.getRange()
        const [startRow, endRow] = this._hs.getRange()

        range.startCol = startCol
        range.endCol = endCol
        range.startRow = startRow
        range.endRow = endRow

        return range
    }

    _getSizes() {
        const width = this._ws.getSizes()
        const height = this._hs.getSizes()
        return { width, height }
    }
}