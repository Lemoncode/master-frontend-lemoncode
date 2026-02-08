import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

// Extender el tipo Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export interface JWTPayload {
  userId: string;
  type: "session" | "temp";
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Leer token de la cookie en lugar del header
  const token = req.cookies.sessionToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticación requerido",
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Solo permitir tokens de sesión en endpoints protegidos
    if (decoded.type !== "session") {
      return res.status(403).json({
        success: false,
        message: "Token inválido para esta operación",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

export const generateSessionToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "fallback-secret";

  return jwt.sign({ userId, type: "session" }, secret, { expiresIn: "1h" });
};

export const generateTempToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "fallback-secret";

  return jwt.sign({ userId, type: "temp" }, secret, { expiresIn: "5m" });
};

export const verifyTempToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, secret) as JWTPayload;

    if (decoded.type !== "temp") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};
