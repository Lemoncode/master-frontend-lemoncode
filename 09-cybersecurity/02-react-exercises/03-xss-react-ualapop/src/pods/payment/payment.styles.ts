import { css } from "@emotion/css";

export const root = css`
	background-color: #fff;
	border-radius: 4px;
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
	padding: 20px;
	width: 400px;
	display: flex;
	gap: 3rem;
	flex-direction: column;
	align-items: center;
	align-self: center;
`;

export const header = css`
	font-weight: bold;
`;

export const price = css`
	font-weight: bold;
`;

export const img = css`
	width: 100%;
`;

export const button = css`
	background-color: #405cf5;
	border-radius: 6px;
	padding: 20px;
	color: white;
	font-size: 2rem;
	text-decoration: none;
	text-align: center;
	width: 100%;
`;
