<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

useSeoMeta({
  title: `Login · ${config.public.siteName}`,
  description:
    'Página de login fake usada para demostrar el middleware de Nuxt.',
});

const auth = useState<boolean>('auth', () => false);

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
  <section class="card">
    <h1 class="main-title">Login</h1>
    <p class="hint">
      Esto es <strong>autenticación fake</strong> usando
      <code>useState('auth')</code>. Solo está pensado para enseñar la
      protección del middleware.
    </p>

    <div class="row">
      <div>
        Estado: <strong>{{ auth ? '✅ Autenticad@' : '❌ Anónim@' }}</strong>
      </div>
      <div class="actions">
        <button v-if="!auth" type="button" class="btn" @click="login">
          Iniciar sesión
        </button>
        <button v-else type="button" class="btnSecondary" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>

    <p v-if="!auth" class="redirect">
      Después de iniciar sesión, serás redirigid@ a:
      <code>{{ redirectTo }}</code>
    </p>
  </section>
</template>

<style scoped>
.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  max-width: 680px;
}
.hint {
  color: #6b7280;
  margin: 6px 0 16px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.actions {
  display: flex;
  gap: 10px;
}
.btn,
.btnSecondary {
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}
.btn {
  border: 1px solid #16a34a;
  background: #16a34a;
  color: white;
}
.btnSecondary {
  border: 1px solid #e5e7eb;
  background: white;
}
.redirect {
  margin-top: 14px;
  color: #6b7280;
}
</style>
