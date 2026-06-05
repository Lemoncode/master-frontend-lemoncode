export default defineNuxtRouteMiddleware(() => {
  const auth = useState<boolean>('auth', () => false);

  if (!auth.value) {
    return navigateTo('/login');
  }
});
