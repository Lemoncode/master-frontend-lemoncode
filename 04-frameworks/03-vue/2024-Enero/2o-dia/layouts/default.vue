<template>
  <div
    class="flex flex-col min-h-[100dvh] bg-gray-800 text-white items-stretch"
  >
    <PageHeader />

    <div class="flex flex-grow">
      <aside :style="sidebarElStyles" ref="sidebarEl">
        <Sidebar />
      </aside>

      <button
        aria-label="Resize sidebar"
        class="w-8 self-stretch relative t-0 b-0 bg-gray-700 hover:bg-gray-600 cursor-col-resize"
        @mousedown="onMouseDown"
      />

      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarEl = ref<HTMLElement | null>(null);

const sidebarElStyles = ref({
  width: '200px',
});

const changeWidth = (width: number) => {
  sidebarElStyles.value.width = `${width}px`;
};

const onMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  const startX = e.pageX;

  const startWidth = sidebarEl.value!.getBoundingClientRect().width;

  const onMouseMove = (e: MouseEvent) => {
    const width = startWidth - startX + e.pageX;

    requestAnimationFrame(() => changeWidth(width));
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
};
</script>
