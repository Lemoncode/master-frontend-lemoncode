import { css } from '@emotion/css';

export const root = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    'loadClientButton loadOrderButton'
    'clientList orderList';
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;

export const loadClientButton = css`
  grid-area: loadClientButton;
  justify-self: center;
`;

export const loadOrderButton = css`
  grid-area: loadOrderButton;
  justify-self: center;
`;

export const clientList = css`
  grid-area: clientList;
`;

export const orderList = css`
  grid-area: orderList;
`;
