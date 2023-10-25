import React from "react";
import { Button } from "common/components";
import { routes } from "core";
import { ProductVm } from "./product.vm";
import * as classes from "./product.styles";

interface Props {
	product: ProductVm;
}

export const Product: React.FC<Props> = (props) => {
	const { product } = props;
	return (
		<div className={classes.root}>
			<img
				src={product.image}
				alt={product.description}
				className={classes.image}
			/>
			<p className={classes.price}>{product.price} EUR</p>
			<p className={classes.name}>{product.name}</p>
			<p dangerouslySetInnerHTML={{__html: product.description}}></p>
			<div className={classes.buttonContainer}>
				<Button
					route={routes.payment(product.id.toString())}
					label="Buy"
					className={classes.buttonBuy}
				/>
				<Button route={routes.productList} label="Back to Product List" />
			</div>
		</div>
	);
};
