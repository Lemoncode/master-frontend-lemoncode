<template>
  <button class="button" type="button" @click.prevent="addItem">
    Add to Cart
  </button>
</template>

<script lang="ts" setup>
import { Product } from '@/types'

const props = defineProps<{
  product: Product
}>()

const $emit = defineEmits(['add-item'])

const addItem = () => {
  $emit('add-item', props.product)
}
</script>
