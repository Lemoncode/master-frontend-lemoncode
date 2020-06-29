export const isValidLogin = (
  user: string,
  password: string
): Promise<boolean> =>
  new Promise(resolve => {
    setTimeout(() => {
      // mock call
      resolve(user === 'admin' && password === 'test');
    }, 500);
  });
