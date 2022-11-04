import React from "react";
import { Button } from "common/components/button/button.component";
import { routes } from "core";
import * as classes from "./home.styles";

export const Home: React.FC = () => {
	return (
		<div className={classes.root}>
			<div className={classes.buttonContainer}>
				<Button route={routes.productList} label="Product List" />
				<Button
					route={routes.createProduct}
					label="Create Product"
					className={classes.button}
				/>
			</div>
		</div>
	);
};
