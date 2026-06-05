<script setup lang="ts">
const config = useRuntimeConfig();
const auth = useState<boolean>('auth', () => false);
const { items, totalItems, totalPrice, removeFromCart } = useCart();

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
});

useSeoMeta({
  title: `Admin · ${config.public.siteName}`,
  description: 'Página protegida demo: protegida por el middleware de rutas.',
});
</script>

<template>
  <section class="panel">
    <h1 class="main-title">Admin</h1>
    <p class="hint">
      Solo puedes ver esta página si <code>useState('auth')</code> es
      <code>true</code>.
    </p>
    <p class="hint">Middleware: <code>/middleware/auth.ts</code>.</p>
    <p class="hint">Layout: <code>/layouts/admin.vue</code>.</p>

    <div class="meta">
      Autenticación: <strong>{{ auth ? '✅ ON' : '❌ OFF' }}</strong> ·
      Artículos en el carrito:
      <strong>{{ totalItems }}</strong>
      · Precio total: <strong>{{ totalPrice }} €</strong>
    </div>

    <h2>Carrito (demo de estado global)</h2>
    <div v-if="items.length === 0" class="empty">
      Tu carrito está vacío (por favor, sé un poco más consumista).
    </div>

    <ul v-else class="list">
      <li v-for="i in items" :key="i.product.id" class="row">
        <div>
          <strong>{{ i.product.name }}</strong>
          <span class="muted">&nbsp;× {{ i.quantity }}</span>
        </div>
        <button
          type="button"
          class="btnSecondary"
          @click="removeFromCart(i.product.id)"
        >
          Eliminar
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}
.hint,
.muted {
  color: #6b7280;
}
.meta {
  margin: 10px 0 18px;
}
.empty {
  padding: 12px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
}
.btnSecondary {
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: white;
}
</style>
