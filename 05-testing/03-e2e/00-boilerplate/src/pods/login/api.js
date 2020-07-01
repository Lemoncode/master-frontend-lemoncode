export const validateCredentials = (user, password) =>
  new Promise(resolve => setTimeout(() => resolve(password === 'test'), 500));
