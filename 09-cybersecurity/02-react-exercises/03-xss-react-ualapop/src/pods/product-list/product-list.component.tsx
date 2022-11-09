import React from "react";
import { Link } from "react-router-dom";
import { routes } from "core";
import { Button } from "common/components";
import { Product } from "./product-list.vm";
import * as classes from "./product-list.styles";

interface Props {
	productList: Product[];
}

export const ProductList: React.FC<Props> = (props) => {
	const { productList } = props;

	return (
		<div className={classes.root}>
			<div className={classes.cardList}>
				{productList.map((product) => (
					<Link
						to={routes.product(product.id.toString())}
						className={classes.link}
						key={product.id}
					>
						<div className={classes.cardContainer}>
							<img
								src={product.image}
								alt={product.description}
								className={classes.image}
							/>
							<span>{product.price} EUR</span>
							<span className={classes.name}>{product.name}</span>
							<span className={classes.description}>{product.description}</span>
						</div>
					</Link>
				))}
			</div>
			<Button route={routes.root} label="Go Home" />
		</div>
	);
};
