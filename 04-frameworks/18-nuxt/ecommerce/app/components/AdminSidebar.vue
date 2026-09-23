<script setup lang="ts">
const auth = useState<boolean>('auth', () => false);
</script>

<template>
  <aside class="sidebar">
    <h2 class="title">Admin</h2>

    <div class="meta">
      Auth: <strong>{{ auth ? '✅ ON' : '❌ OFF' }}</strong>
    </div>

    <nav class="nav">
      <NuxtLink to="/">← Volver a la tienda</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  border-right: 1px solid #e5e7eb;
  background: white;
  padding: 16px;
}
.title {
  margin: 0 0 12px;
}
.meta {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}
.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
