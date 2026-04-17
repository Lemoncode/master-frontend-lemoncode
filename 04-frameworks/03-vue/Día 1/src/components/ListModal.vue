<script setup lang="ts">
// defineProps<{
//   id: string;
// }>();

import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

// const router = useRouter();
const route = useRoute();

const listId = computed(() => route.params.id as string);
</script>
