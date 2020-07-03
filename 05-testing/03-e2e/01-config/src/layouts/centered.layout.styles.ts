import { css } from 'emotion';
import { theme } from 'core/theme';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  margin-top: 2rem;

  @media (min-width: ${theme.breakpoints.values.sm}px) {
    justify-items: center;
  }
`;
