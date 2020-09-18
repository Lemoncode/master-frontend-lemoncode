import { css } from 'emotion';
import { theme } from 'core/theme';

export const cell = css`
  padding: 0.5rem;
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.primary.contrastText};
`;
