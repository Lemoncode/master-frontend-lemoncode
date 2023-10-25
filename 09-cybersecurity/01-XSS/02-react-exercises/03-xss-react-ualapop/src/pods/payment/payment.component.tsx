import React from "react";
import { Button } from "common/components";
import { Product } from "./payment.vm";
import * as classes from "./payment.styles";

interface Props {
  product: Product;
}

export const Payment: React.FC<Props> = (props) => {
  const { product } = props;

  return (
    <div className={classes.root}>
      <h1 className={classes.header}>Purchase Summary</h1>
      <img src={product.image} alt={product.name} className={classes.img} />
      <p className={classes.price}>Amount: {product.price} EUR</p>

      <a
        href="http://localhost:1235"
        target="_blank"
        className={classes.button}
      >
        Pay
      </a>
    </div>
  );
};
