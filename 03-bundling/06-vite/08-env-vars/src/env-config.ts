const config = {
  API_BASE: import.meta.env.VITE_API_BASE,
  IS_FEATURE_A_ENABLED: import.meta.env.VITE_ENABLE_FEATURE_A === 'true',
} as const;

export default config;
