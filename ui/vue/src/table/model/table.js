import { Store } from './store'

export class Table {
    constructor() {
        this._ws = new Store()
        this._hs = new Store()
    }

    get ncols() {
        return this._ws.length
    }















































    

    get nrows() {
        return this._hs.length
    }

 

    autosize() {

    }
}