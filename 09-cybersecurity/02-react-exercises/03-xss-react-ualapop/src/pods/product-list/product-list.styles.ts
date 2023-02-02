import { css } from "@emotion/css";

export const root = css`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	align-self: center;
	gap: 20px;
`;

export const cardList = css`
	display: grid;
	grid-template-columns: repeat(3, 300px);
	grid-gap: 1rem;
	margin: 1rem;
`;

export const cardContainer = css`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	border: 1px solid #fff;
	border-radius: 5px;
	padding: 7px;
	font-weight: 500;
	font-size: 1.5rem;
	width: 200px;
	gap: 0.4rem;
	background-color: #fff;
	text-decoration: none;
	width: 100%;
	height: 100%;
`;

export const name = css`
	font-weight: normal;
	font-size: 1.4rem;
`;

export const description = css`
	font-weight: lighter;
	font-size: 1.1rem;
	margin-bottom: 2rem;
`;

export const image = css`
	width: 100%;
	border-radius: 5px;
`;

export const link = css`
	text-decoration: none;
	color: #000;
`;
