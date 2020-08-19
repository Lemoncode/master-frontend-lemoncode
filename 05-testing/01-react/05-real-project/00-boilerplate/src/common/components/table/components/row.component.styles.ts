import { css } from 'emotion';
import { theme } from 'core/theme';

export const root = css`
  &:nth-child(odd) {
    background-color: ${theme.palette.background.default};
  }
`;
