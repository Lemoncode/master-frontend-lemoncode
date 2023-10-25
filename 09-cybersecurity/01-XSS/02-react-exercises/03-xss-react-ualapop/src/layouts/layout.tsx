import React from "react";
import * as classes from "./layout.styles";
import logo from "core/assets/Ualapop.svg";

interface Props {
	children: React.ReactNode;
}

export const Layout: React.FC<Props> = ({ children }) => (
	<div className={classes.root}>
		<img src={logo} alt="Ualapop" className={classes.logo} />
		<div className={classes.content}>{children}</div>
	</div>
);
