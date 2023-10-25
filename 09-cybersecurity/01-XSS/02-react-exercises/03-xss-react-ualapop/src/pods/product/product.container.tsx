import React from "react";
import { useParams } from "react-router-dom";
import { ProductVm, createEmptyProduct } from "./product.vm";
import { getProduct } from "./api";
import { Product } from "./product.component";

export const ProductContainer: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = React.useState<ProductVm>(createEmptyProduct());

  const loadProduct = async () => {
    const product = await getProduct(id);
    setProduct(product);
  };

  React.useEffect(() => {
    loadProduct();
  }, []);

  return <Product product={product} />;
};
