<template>
  <div>
    <h1>Oops!</h1>
    <p>
      {{ error?.message }}
    </p>
    <p>
      {{ (error as CustomError)?.statusCode }}
    </p>
  </div>
</template>

<script setup lang="ts">
type CustomError = {
  statusCode: string
}

const error = useError()
</script>
