import { css } from 'emotion';

export const root = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  & > :nth-child(n + 2) {
    margin-top: 1rem;
  }
`;

export const search = css`
  width: 100%;
`;

export const table = css`
  display: flex;
  flex-direction: column;
`;

export const pagination = css`
  align-self: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;
