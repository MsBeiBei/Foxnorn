export class ViewModel {
    constructor() {
        this.rows = []
        this.cells = []
    }

    _clean_columns(cidx) {
        for (let i = 0; i < this.rows.length; i++) {


        }
    }

    _clean_rows(ridx) {
        this.rows = this.rows.slice(0, ridx);
        this.cells = this.cells.slice(0, ridx);
    }
}