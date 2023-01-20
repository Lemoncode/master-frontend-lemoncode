<template>
  <div>
    <h1>Oops!</h1>
    <p>
      {{ error?.message }}
    </p>
    <p>
      {{ error?.statusCode }}
    </p>
  </div>
</template>

<script setup lang="ts">
const error = useError()
</script>
