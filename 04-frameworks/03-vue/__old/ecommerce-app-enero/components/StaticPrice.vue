<template>
  <div>
    {{ parsedPrice }}
  </div>
</template>

<script lang="ts" setup>
type Coin = 'EUR' | 'USD'

const props = withDefaults(
  defineProps<{
    quantity: number
    coin?: Coin
  }>(),
  {
    coin: 'EUR',
  }
)

const locale = computed(() => {
  switch (props.coin) {
    case 'USD':
      return 'en-US'
    default:
      return 'es-ES'
  }
})

const parsedPrice = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: props.coin,
  }).format(props.quantity)
})
</script>
