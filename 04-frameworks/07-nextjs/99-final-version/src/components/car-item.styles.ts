import { css } from '@emotion/css';
import { theme } from '../common';

export const cardMedia = css`
  height: 0;
  padding-top: 56.25%;
`;

export const availableIcon = css`
  fill: ${theme.palette.success.main};
`;

export const bookedIcon = css`
  fill: ${theme.palette.error.main};
`;
