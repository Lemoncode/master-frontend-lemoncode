import { css } from "@emotion/css";

export const root = css`
	display: grid;
	grid-template-rows: auto 1fr;
	justify-items: center;
	gap: 20px;
	width: 100%;
	height: 100vh;
	background-color: white;
`;

export const logo = css`
	padding: 20px;
`;

export const content = css`
	display: flex;
	flex-direction: column;
	padding: 30px;
	overflow-y: auto;
	background-color: whitesmoke;
	width: 100%;
	height: 100%;
`;
