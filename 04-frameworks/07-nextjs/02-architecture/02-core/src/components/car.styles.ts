import { css } from '@emotion/css';
import { theme } from 'core/theme';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto auto;
  grid-template-areas:
    'name'
    'image'
    'features'
    'book';
  column-gap: 2rem;
  row-gap: 2rem;
  align-items: center;

  @media (min-width: ${theme.breakpoints.values.md}px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      'name .'
      'image features'
      'book book';
  }
`;

export const name = css`
  grid-area: name;
  justify-self: center;
  @media (min-width: ${theme.breakpoints.values.md}px) {
    justify-self: stretch;
  }
`;

export const book = css`
  grid-area: book;
  align-self: center;
  justify-self: center;
`;

export const image = css`
  grid-area: image;
  position: relative;
  justify-self: stretch;
  align-self: stretch;
`;

export const features = css`
  grid-area: features;
  list-style: none;
`;
