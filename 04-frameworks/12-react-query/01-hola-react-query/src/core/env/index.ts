interface EnvVariables {
  GITHUB_API_BASE_URL: string;
}

export const ENV_VARIABLES: EnvVariables = {
  GITHUB_API_BASE_URL: import.meta.env.VITE_GITHUB_API_BASE_URL,
};
