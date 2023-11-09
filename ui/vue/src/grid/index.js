import Grid from './components/Grid.vue'

Grid.install = (vue) => {
    vue.component(Grid.name, Grid)
}

export default Grid
