import { ACTION_VIEWPORT_RESIZE, ACTION_ITEM_RESIZE, ACTION_SCROLL } from '../utilties/constants'
import { Store } from './store'

export class Table {
    constructor({ ncols, nrows }, callback = () => { }) {
        this._ws = new Store(ncols)
        this._hs = new Store(nrows)

        this._range = null
        this._callback = callback
    }

    set viewport([width, height]) {
        this._ws.update(ACTION_VIEWPORT_RESIZE, width)
        this._hs.update(ACTION_VIEWPORT_RESIZE, height)

        this._range = this._getRange()

        this._callback(this._range)
    }


    set cell({ ridx, cidx, width, height }) {
        this._ws.update(ACTION_ITEM_RESIZE, [cidx, width])
        this._hs.update(ACTION_ITEM_RESIZE, [ridx, height])

        this._range = this._getRange()

        this._callback(this._range)
    }

    set offset({ top, left }) {
        this._ws.update(ACTION_SCROLL, left)
        this._hs.update(ACTION_SCROLL, top)

        this._range = this._getRange()

        this._callback(this._range)
    }


    _getRange() {
        const range = Object.create(null)

        const [startCol, endCol] = this._ws.getRange()
        const [startRow, endRow] = this._hs.getRange()

        range.startCol = Math.floor(startCol)
        range.endCol = Math.ceil(endCol)
        range.startRow = Math.floor(startRow)
        range.endRow = Math.ceil(endRow)

        return range
    }


}