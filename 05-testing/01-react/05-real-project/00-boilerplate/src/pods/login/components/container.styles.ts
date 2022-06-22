import { css } from '@emotion/css';
import { theme } from 'core/theme';

export const paper = css`
  margin-top: ${theme.spacing(8)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const avatar = css`
  margin: ${theme.spacing(1)};
  background-color: ${theme.palette.secondary.main};
`;
