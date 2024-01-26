<template>
  <button class="button" type="button" @click.prevent="addItem">
    Add to Cart
  </button>
</template>

<script lang="ts" setup>
import { Product } from 'types'

const $emit = defineEmits(['add-item'])

const props = defineProps<{
  product: Product
}>()

const addItem = () => {
  $emit('add-item', props.product)
}
</script>
