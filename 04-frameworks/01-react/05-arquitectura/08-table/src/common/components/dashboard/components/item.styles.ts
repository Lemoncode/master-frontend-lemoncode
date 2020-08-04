import { css } from 'emotion';

export const root = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  border: none;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #e6e6e6;
  }
`;

export const icon = css`
  font-size: 5rem;
`;

export const title = css`
  margin-top: 20px;
`;

export const subtitle = css`
  margin-top: 20px;
`;
