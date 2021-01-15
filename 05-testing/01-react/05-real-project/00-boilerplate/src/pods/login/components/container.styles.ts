import { css } from 'emotion';
import { theme } from 'core/theme';

export const paper = css`
  margin-top: ${theme.spacing(8)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const avatar = css`
  margin: ${theme.spacing(1)}px;
  background-color: ${theme.palette.secondary.main};
`;
