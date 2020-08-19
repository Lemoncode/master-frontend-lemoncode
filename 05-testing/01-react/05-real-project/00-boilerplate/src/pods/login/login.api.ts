export const isValidLogin = (
  user: string,
  password: string
): Promise<boolean> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(user === 'admin' && password === 'test');
    }, 1000);
  });
