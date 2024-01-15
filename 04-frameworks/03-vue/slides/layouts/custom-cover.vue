<template>
  <div class="slidev-layout cover" :style="backgroundStyle">
    <div class="my-auto w-full">
      <slot />
    </div>

    <div class="abs-br m-6 flex gap-2">
      <a
        href="https://github.com/Lemoncode/master-frontend-lemoncode/tree/master/04-frameworks/03-vue"
        target="_blank"
        alt="GitHub"
        title="Open in GitHub"
        class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white"
      >
        <carbon-logo-github />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  background: {
    type: String,
    default: '',
  },
});

const backgroundStyle = computed(() => {
  if (props.background) {
    return {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.333), rgba(0, 0, 0, 0.533)), url(${props.background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
});
</script>
