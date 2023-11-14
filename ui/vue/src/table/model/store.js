import { DEFAULT_SIZE } from '../utilties/constants'

export class Store {
    _auto = []

    _override = []

    _indices = []

    constructor(length, size, virtual) {
        this._length = length ?? 0
        this._defaultSize = size ?? DEFAULT_SIZE
        this._virtual = virtual ? true : false
    }
}