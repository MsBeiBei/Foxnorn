export class ViewModel {
    constructor() {
        this.cells = []
    }

    _get_cell_size(ridx, cidx) {
        if (ridx < 0 || cidx < 0) {
            return;
        }

        return this.cells[ridx]?.[cidx];
    }
}