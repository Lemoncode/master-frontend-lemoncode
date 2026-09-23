<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
  title: `Login · ${config.public.siteName}`,
  description:
    'Página de login fake usada para demostrar el middleware de Nuxt.',
});

const auth = useState<boolean>('auth', () => true);

const redirectTo = computed(() => {
  const q = route.query.redirect;
  return typeof q === 'string' && q.length > 0 ? q : '/admin';
});

function login() {
  auth.value = true;
  navigateTo(redirectTo.value);
}

function logout() {
  auth.value = false;
}
</script>

<template>
  <section class="wrap">
    <h1>Login</h1>
    <p>Demo: pulsa el botón para iniciar sesión.</p>
    <button type="button" class="btn" @click="login">Entrar</button>
    <button type="button" class="btn" @click="logout">Cerrar sesión</button>
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
