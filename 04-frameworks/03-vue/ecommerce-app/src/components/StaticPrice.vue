<template>
  <div>
    {{ parsedPrice }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

type Coin = 'EUR' | 'USD'

// $ 43545
// 43545 €

export default defineComponent({
  props: {
    quantity: {
      type: String,
      required: true,
      default: '',
    },
    coin: {
      type: String as PropType<Coin>,
      default: 'EUR',
      validator(value: Coin) {
        return ['EUR', 'USD'].includes(value)
      },
    },
  },
  computed: {
    floatPrice(): number {
      return parseFloat(String(this.quantity).replace(',', '.'))
    },
    // TODO: make locale a global property using vue-i18n
    // not always a currency is bound to a country/language
    locale(): string {
      return this.coin === 'EUR' ? 'es-ES' : 'en-US'
    },
    parsedPrice(): string {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency',
        currency: this.coin,
      }).format(this.floatPrice)
    },
  },
})
</script>
