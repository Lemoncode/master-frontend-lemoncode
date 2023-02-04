import { defineStore } from 'pinia'
import { CartItemRecord, Product } from '~~/types'

export const useCartStore = defineStore('cart', () => {
  const { getCart, setCart } = useCartApi()

  const items = ref<CartItemRecord>({})

  const totalItems = computed(() =>
    Object.values(items.value).reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  )

  const addItem = async (newItem: Product) => {
    const newCartItem = {
      quantity: items.value[newItem.id]?.quantity + 1 || 1,
      data: newItem,
    }

    if (items.value[newItem.id]) {
      items.value[newItem.id] = newCartItem
      await setCart(items.value)
    } else {
      await setCart({ [newItem.id]: newCartItem })
    }
  }

  useAsyncData('cart', async () => {
    items.value = await getCart()
  })

  return {
    items,
    addItem,
    totalItems,
  }
})
