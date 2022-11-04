export const envConstants = {
  isProduction: process.env.NODE_ENV === "production",
  PORT: process.env.PORT,
  STATIC_FILES_PATH: process.env.STATIC_FILES_PATH,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CORS_METHODS: process.env.CORS_METHODS,
  AUTH_SECRET: process.env.AUTH_SECRET,
};
