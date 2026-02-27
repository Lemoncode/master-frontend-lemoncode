import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);

app.get("/api/hello", (_req, res) => {
  res.json({
    message: "¡Hola desde el backend! 🚀",
    timestamp: new Date().toISOString(),
  });
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

start();
