export const login = async (
  email: string,
  password: string
): Promise<string> => {
  if (email === 'john@email.com' && password === 'test') {
    return 'John Doe';
  } else {
    throw new Error('Invalid credentials');
  }
};
