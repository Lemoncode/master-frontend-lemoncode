import { css } from '@emotion/css';
import { theme } from 'core/theme';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 2rem;
  row-gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (min-width: ${theme.breakpoints.values.sm}px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${theme.breakpoints.values.md}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;
