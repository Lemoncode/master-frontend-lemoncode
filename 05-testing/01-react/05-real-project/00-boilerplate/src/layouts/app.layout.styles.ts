import { css } from 'emotion';
import { theme } from 'core/theme';

export const container = css`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const main = css`
  flex: 1;
  padding: ${theme.spacing(0.2)}rem;
`;
