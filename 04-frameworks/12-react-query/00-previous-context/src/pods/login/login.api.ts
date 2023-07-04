export const doLogin = (
  username: string,
  password: string
): Promise<Boolean> => {
  const promise = new Promise<Boolean>((resolve, reject) => {
    // Simulating Ajax Call
    setTimeout(() => {
      resolve(username === "admin" && password === "test");
    }, 500);
  });
  return promise;
};
