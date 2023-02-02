import { css } from "@emotion/css";

export const root = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  border-radius: 2rem;
  width: 40rem;
  padding: 3rem;
  font-size: 1.5rem;
`;

export const input = css`
  height: 3rem;
  border-radius: 0.5rem;
  transition: all 0.3s;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  padding: 1rem;
  &:focus {
    border: 1px solid #ffdc8a;
    outline: none;
  }
`;

export const textarea = css`
  ${input}
  height: 10rem;
`;

export const button = css`
  border: none;
  border-radius: 0.5rem;
  background-color: #b87c4c;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 1rem;
  cursor: pointer;
`;
