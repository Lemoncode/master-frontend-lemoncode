import { createStore, ModuleTree } from 'vuex'
import CartModule from './Cart'

export type State = { modules: ModuleTree<typeof CartModule> }

export default createStore({
  modules: {
    CartModule,
  },
})
