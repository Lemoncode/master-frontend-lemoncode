<script setup lang="ts">
const auth = useState<boolean>('auth', () => false);

function login() {
  auth.value = true;
  navigateTo('/admin');
}
</script>

<template>
  <section class="wrap">
    <h1>Login</h1>
    <p>Demo: pulsa el botón para iniciar sesión.</p>
    <button type="button" class="btn" @click="login">Entrar</button>
  </section>
</template>

<style scoped>
.wrap {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}
.btn {
  margin-top: 12px;
  padding: 8px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fef9c3;
  cursor: pointer;
}
</style>
