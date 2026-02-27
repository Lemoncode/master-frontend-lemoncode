<template>
  <header class="header">
    <nav class="nav">
      <div class="brand main-title">
        {{ siteName }}
      </div>

      <div class="links">
        <NuxtLink to="/">Home</NuxtLink>

        <NuxtLink to="/login">Login</NuxtLink>
        <NuxtLink to="/admin">Admin</NuxtLink>
        <button v-if="auth" class="linkLike" type="button" @click="logout">
          Cerrar sesión
        </button>
      </div>

      <span class="cart">
        🛒 Carrito: <strong class="tabular-nums">{{ totalItems }}</strong> ·
        <strong class="tabular-nums">{{ totalPrice }} €</strong>
      </span>
    </nav>
  </header>
</template>

<script setup lang="ts">
const auth = useState('auth', () => false);

const config = useRuntimeConfig();
const siteName = config.public.siteName;

const { totalItems, totalPrice } = useCart();

function logout() {
  auth.value = false;
  navigateTo('/');
}
</script>

<style scoped>
.header {
  border-bottom: 1px solid #e5e7eb;
  background: white;
}
.nav {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand {
  text-decoration: none;
}
.links {
  display: flex;
  align-items: center;
  gap: 12px;
}
.cart {
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  font-size: 14px;
}
.linkLike {
  background: transparent;
  border: none;
  padding: 0;
  color: #6a6120;
  cursor: pointer;
}
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
