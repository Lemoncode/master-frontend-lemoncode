/// <reference types="vite/client" />

// We'll add here our environment variables. Remember all have string values.
interface ImportMetaEnv {
  readonly VITE_API_BASE: string
  readonly VITE_ENABLE_FEATURE_A: string;
}
