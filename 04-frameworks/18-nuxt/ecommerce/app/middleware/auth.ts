export default defineNuxtRouteMiddleware((to) => {
  const auth = useState<boolean>('auth', () => false);

  if (auth.value) return;

  // This is intentionally "fake auth":
  // - it uses in-memory state (so refresh/log out of SSR request resets it)
  // - it's perfect for learning middleware + route protection
  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  });
});
