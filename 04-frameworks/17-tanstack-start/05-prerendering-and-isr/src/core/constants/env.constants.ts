export const ENV = {
  BASE_API_URL:
    process.env.PUBLIC_BASE_API_URL ||
    import.meta.env.PUBLIC_BASE_API_URL ||
    '',
  BASE_PICTURES_URL:
    process.env.PUBLIC_BASE_PICTURES_URL ||
    import.meta.env.PUBLIC_BASE_PICTURES_URL ||
    '',
};
