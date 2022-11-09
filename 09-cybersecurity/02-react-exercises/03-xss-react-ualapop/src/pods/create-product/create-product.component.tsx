import React from "react";
import { useNavigate } from "react-router-dom";
import { Product, createEmptyProduct } from "./create-product.vm";
import { routes } from "core";
import { saveProduct } from "./api";
import image from "core/assets/imac.jpg";
import * as classes from "./create-product.styles";

export const CreateProduct = () => {
  const [product, setProduct] = React.useState<Product>(createEmptyProduct());
  const [hack, setHack] = React.useState('javascript:alert("Hacked")');

  const navigate = useNavigate();

  const updateFieldValue = (name: keyof Product) => (e) => {
    setProduct({
      ...product,
      [name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newProduct = saveProduct({
      ...product,
      id: Date.now(),
      image:
        "http://drive.google.com/uc?export=view&id=1mDCB37dByS2Zbh3OBvs3Cd5Y-ZLF8adA",
      price: Number(product.price),
    });
    setProduct(createEmptyProduct());
    setTimeout(() => navigate(routes.productList), 2000);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={classes.root}>
          <img src={image} alt="product photo" />
          <label htmlFor="name">Name:</label>
          <input
            name="name"
            onChange={updateFieldValue("name")}
            value={product.name}
            className={classes.input}
          />
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            onChange={updateFieldValue("description")}
            value={product.description}
            className={classes.textarea}
          />
          <label htmlFor="price">Price:</label>
          <input
            name="price"
            onChange={updateFieldValue("price")}
            value={product.price}
            className={classes.input}
          />
          <button type="submit" className={classes.button}>
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};
