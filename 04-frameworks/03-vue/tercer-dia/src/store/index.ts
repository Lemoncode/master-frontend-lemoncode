import { createStore } from 'vuex'
import CartModule from './modules/cart'

export default createStore({
  modules: {
    CartModule,
  },
})
