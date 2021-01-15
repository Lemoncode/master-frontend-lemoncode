import { css } from 'emotion';
import { theme } from 'core/theme';

export const modal = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const loaderContainer = css`
  border-radius: 15%;
  background-color: ${theme.palette.common.white};
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
`;
