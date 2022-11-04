import React from "react";
import { getProductList } from "./api";
import { Product } from "./product-list.vm";
import { ProductList } from "./product-list.component";

export const ProductListContainer: React.FC = () => {
  const [productList, setProductList] = React.useState<Product[]>([]);

  const loadProducts = async () => {
    const productList = await getProductList();
    setProductList(productList);
  };

  React.useEffect(() => {
    loadProducts();
  }, []);

  return <ProductList productList={productList} />;
};
