import { css } from '@emotion/css';
import { theme } from 'core/theme';

export const form = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'month' 'year' 'commands' 'commands';
  grid-column-gap: ${theme.spacing(2)};

  ${theme.breakpoints.up('md')} {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'month year' 'commands commands';
  }
`;

export const month = css`
  grid-area: month;
`;

export const year = css`
  grid-area: year;
`;

export const commands = css`
  grid-area: commands;
`;
