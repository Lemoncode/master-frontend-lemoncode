import { css } from '@emotion/css';
import { theme } from '#core/theme';

export const root = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > :nth-child(n) {
    margin-top: 1rem;
  }

  @media (min-width: ${theme.breakpoints.values.sm}px) {
    min-width: 400px;
  }
`;
