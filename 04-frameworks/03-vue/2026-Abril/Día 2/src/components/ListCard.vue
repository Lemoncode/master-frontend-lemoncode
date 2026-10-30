<template>
  <div :style="{ viewTransitionName: `card-${list.id}` }">
    <h2>{{ list?.title }}</h2>

    <!-- Todo List-->
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit, nostrum, fugiat accusamus
    voluptate qui quo dolor, modi sed sunt explicabo quod ducimus vitae adipisci necessitatibus
  </div>
</template>

<script setup lang="ts">
import type { List } from "@/types";

const props = defineProps<{
  list: List;
}>();
</script>
