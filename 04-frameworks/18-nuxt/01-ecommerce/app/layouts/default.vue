<template>
  <div class="page">
    <AppHeader />

    <main class="main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main {
  max-width: 980px;
  margin: 0 auto auto;
  padding: 24px 16px;
}
</style>
