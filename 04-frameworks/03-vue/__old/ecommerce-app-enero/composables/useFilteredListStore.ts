import { Product } from '~~/types'
import { defineStore } from 'pinia'

export const useFilteredListStore = defineStore('filteredList', {
  state: () => ({
    list: [] as Product[],
    textFilter: '',
  }),
  getters: {
    filteredList: (state) => {
      return state.list.filter((product) => {
        if (!state.textFilter) return state.list
        return product.title
          .toLowerCase()
          .includes(state.textFilter.toLowerCase())
      })
    },
  },
  actions: {
    setList(list: Product[]) {
      this.list = list
    },
  },
})
