import { Product } from 'types'

export type CartItem = { quantity: number; data: Product }
export type CartItemRecord = Record<Product['id'], CartItem>

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItemRecord>({})

  const { getCart, setCart } = useCartApi()

  const totalItems = computed(() => {
    return Object.values(items.value).reduce((acc, item) => {
      return acc + item.quantity
    }, 0)
  })

  const addToCart = async (item: Product) => {
    const newCartItem = {
      quantity: items.value[item.id]?.quantity + 1 || 1,
      data: item,
    }

    if (items.value[item.id]) {
      items.value[item.id] = newCartItem
      await setCart(items.value)
    } else {
      await setCart({
        ...items.value,
        [item.id]: newCartItem,
      })
    }
  }

  useAsyncData('cart', async () => {
    items.value = await getCart()
  })

  return {
    items,
    totalItems,
    addToCart,
  }
})
