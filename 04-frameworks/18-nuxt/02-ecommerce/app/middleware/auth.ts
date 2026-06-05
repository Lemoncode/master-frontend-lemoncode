export default defineNuxtRouteMiddleware((to) => {
  const auth = useState<boolean>('auth', () => false);

  if (auth.value) return;

  return navigateTo({
    path: '/login',
    query: { redirect: to.fullPath },
  });
});
