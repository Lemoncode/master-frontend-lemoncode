import { css } from "@emotion/css";

export const root = css`
	display: flex;
	flex-direction: column;
	align-self: center;
	gap: 10px;
	background-color: #fff;
	border-radius: 2rem;
	padding: 2rem;
	width: 30%;
`;

export const image = css`
	border-radius: 0.5rem;
`;

export const price = css`
	font-size: 2rem;
	font-weight: bold;
`;

export const name = css`
	font-size: 1.5rem;
`;

export const buttonContainer = css`
	margin: 3rem 0;
	display: flex;
	flex-direction: column;
	gap: 20px;
	justify-content: space-around;

	& > :nth-child(n) {
		font-size: 1.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

export const buttonBuy = css`
	background-color: #b87c4c;
`;
