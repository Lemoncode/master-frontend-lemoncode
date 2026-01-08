<template>
  <div class="page">
    <AppHeader />

    <div class="body">
      <AdminSidebar />
      <main class="main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
}
.body {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: calc(100vh - 64px);
}
.main {
  padding: 24px 16px;
  max-width: 980px;
}
@media (max-width: 860px) {
  .body {
    grid-template-columns: 1fr;
  }
}
</style>
