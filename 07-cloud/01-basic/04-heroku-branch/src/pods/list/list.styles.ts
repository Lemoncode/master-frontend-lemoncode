import { css } from '@emotion/css';

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'title'
    'memberList';
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

export const title = css`
  grid-area: title;
justify-self: center;
text-transform: capitalize;
`;

export const memberList = css`
  grid-area: memberList;
`;
