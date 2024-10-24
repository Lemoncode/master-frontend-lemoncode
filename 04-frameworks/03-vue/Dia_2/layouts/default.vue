<template>
  <div class="flex flex-col min-h-[100dvh] items-stretch">
    <header>
      <TheNavigation />
    </header>

    <div class="flex flex-grow">
      <aside :style="sidebarStyles" ref="sidebarEl">
        <!-- <TheSidebar /> -->
      </aside>
      <button
        aria-label="Resize sidebar"
        class="w-4 self-stretch bg-gray-700 hover:bg-gray-600 cursor-col-resize"
        @mousedown="onMouseDown"
      />
      <main class="flex-grow w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';

useHead({
  htmlAttrs: {
    class: 'bg-gray-800 text-white',
  },
});

// const sidebarEl = templateRef('sidebarEl');
const sidebarEl = ref<HTMLElement | null>(null);
const sidebarStyles = ref({
  width: '200px',
});

const onMouseDown = (event: MouseEvent) => {
  event.preventDefault();

  const startX = event.pageX;

  const startWidth = sidebarEl.value!.getBoundingClientRect().width;

  const onMouseMove = (event: MouseEvent) => {
    event.preventDefault();

    const width = startWidth - startX + event.pageX;

    sidebarStyles.value = {
      width: `${width}px`,
    };
  };
  const onMouseUp = (event: MouseEvent) => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
  // register events
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
</script>
