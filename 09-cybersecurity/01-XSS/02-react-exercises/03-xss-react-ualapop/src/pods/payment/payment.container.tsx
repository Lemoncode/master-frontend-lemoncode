import React from "react";
import { useParams } from "react-router-dom";
import { Payment } from "./payment.component";
import { createEmptyProduct } from "./payment.vm";
import { getProduct } from "./api";

export const PaymentContainer = () => {
  const { id } = useParams();

  const [product, setProduct] = React.useState(createEmptyProduct());

  const loadProduct = async () => {
    const product = await getProduct(id);
    setProduct(product);
  };

  React.useEffect(() => {
    loadProduct();
  }, []);

  return <Payment product={product} />;
};
