import { css } from 'emotion';
import { theme } from 'core/theme';

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

export const submit = css`
  margin: ${theme.spacing(3, 0, 2)};
`;
