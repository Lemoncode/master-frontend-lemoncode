<script setup lang="ts">
import { onMounted, ref, version } from "vue";
const count = ref(0);

const slotContainer = ref<HTMLElement | null>(null);
onMounted(() => {
  if (slotContainer.value) {
    const slot = document.createElement("slot");
    slot.setAttribute("name", "user-name");
    slotContainer.value.appendChild(slot);
  }
});
</script>

<template>
  <div>
    <h2>Microfrontend 1</h2>
    <p>This mfe is using Rsbuild and Vue {{ version }}</p>
    <div ref="slotContainer"></div>
    <button @click="count++">Count is {{ count }}</button>
  </div>
</template>

<style scoped>
h2 {
  color: #42b983;
}
</style>
