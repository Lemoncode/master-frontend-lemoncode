export type Variant = 'success' | 'info' | 'warning' | 'error';

export interface SnackbarOptions {
  message: string;
  variant: Variant;
}
