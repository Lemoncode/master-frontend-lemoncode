import { css } from '@emotion/css';

export const toolbar = css`
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  row-gap: 1rem;

  & > :nth-child(3) {
    margin-left: auto;
  }
`;

export const iconButton = css`
  width: 3rem;
  height: 3rem;
`;

export const content = css`
  margin: 2rem;
`;
