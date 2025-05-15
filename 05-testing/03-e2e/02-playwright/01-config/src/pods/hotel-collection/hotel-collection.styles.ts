import { css } from '@emotion/css';
import { theme } from '#core/theme';

export const root = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  list-style: none;
  max-width: ${theme.breakpoints.values.lg}px;
  margin: 0 auto;
  padding: 0;
`;
