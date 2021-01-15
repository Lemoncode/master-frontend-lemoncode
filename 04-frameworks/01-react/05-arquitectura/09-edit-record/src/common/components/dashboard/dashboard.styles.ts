import { css } from 'emotion';
import { theme } from 'core/theme';

export const root = css`
  display: flex;
  flex-direction: column;
`;

export const items = css`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 4rem;

  @media (min-width: ${theme.breakpoints.values.sm}px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const item = css`
  padding: 2rem 0rem;
`;
