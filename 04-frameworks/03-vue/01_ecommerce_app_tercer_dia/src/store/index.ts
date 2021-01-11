import { createStore } from 'vuex'
import CartModule from './Cart'

export default createStore({
  modules: {
    CartModule,
  },
})
