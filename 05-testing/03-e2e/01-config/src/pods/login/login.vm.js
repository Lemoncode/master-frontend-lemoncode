export const createEmptyCredentials = () => ({
  login: '',
  password: '',
});

export const createEmptyCredentialErrors = () => ({
  login: {
    succeded: true,
    message: '',
  },
  password: {
    succeded: true,
    message: '',
  },
});
