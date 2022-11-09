import express from "express";
import cors from "cors";
import {
  getProductList,
  getProduct,
  insertProduct,
  deleteProduct,
} from "./mock-db";

const app = express();
app.use(express.json());
app.use(
  cors({
    methods: "GET",
    origin: "http://localhost:1234",
  })
);

app.get("/", (req, res) => {
  res.send("Example 2 XSS React attack");
});

app.get("/api/products", async (req, res) => {
  const productList = await getProductList();
  res.send(productList);
});

app.get("/api/products/:id", async (req, res) => {
  const product = await getProduct(Number(req.params.id));
  res.send(product);
});

app.post("/api/products", async (req, res) => {
  const newProduct = await insertProduct(req.body);
  res.status(201).send(newProduct);
});

app.delete("/api/products/:id", async (req, res) => {
  await deleteProduct(Number(req.params.id));
  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log("Server ready at port 3000");
});
