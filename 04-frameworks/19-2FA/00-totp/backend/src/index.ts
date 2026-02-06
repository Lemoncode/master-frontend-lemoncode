import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./db/connection";
import authRoutes from "./routes/auth.routes";
import twoFactorRoutes from "./routes/twoFactor.routes";
import userRoutes from "./routes/user.routes";
import protectedRoutes from "./routes/protected.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // URL del frontend
    credentials: true, // Permitir cookies
  })
);
app.use(cookieParser());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.use("/api", authRoutes);
app.use("/api/2fa", twoFactorRoutes);
app.use("/api/user", userRoutes);
app.use("/api/protected", protectedRoutes);

// Endpoint de salud
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
