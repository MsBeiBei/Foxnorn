export class Store {
    auto = []

    override = []

    indices = []

    length = 0

    update_size(idx, size) {
        this.indices[idx] = size
    }
}