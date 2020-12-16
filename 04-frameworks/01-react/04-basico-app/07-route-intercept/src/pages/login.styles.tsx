import { css } from "@emotion/css";

export const root = css`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  margin-top: 2rem;
  @media (min-width: 800px) {
    justify-items: center;
  }
`;
