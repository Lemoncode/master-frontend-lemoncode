export const isValidLogin = async (
  user: string,
  password: string
): Promise<boolean> => {
  return user === 'admin' && password === 'test';
};
