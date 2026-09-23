import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection";
import { User, hashPassword, comparePassword } from "../models/User";
import { generateSessionToken, generateTempToken } from "../middleware/auth";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario por email
    const user = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Si el usuario tiene 2FA habilitado, devolver token temporal
    if (user.twoFactorEnabled) {
      const tempToken = generateTempToken(user._id!.toString());

      return res.json({
        success: true,
        message: "Verificación 2FA requerida",
        data: {
          requiresTwoFactor: true,
          tempToken,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
          },
        },
      });
    }

    // Si no tiene 2FA, devolver token de sesión directamente
    const sessionToken = generateSessionToken(user._id!.toString());

    // Establecer cookie httpOnly
    res.cookie("sessionToken", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          twoFactorEnabled: false,
        },
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

export const signup = async (
  req: Request<{}, {}, SignupRequest>,
  res: Response
) => {
  try {
    const { email, password, name } = req.body;

    // Validación básica
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Nombre, email y contraseña son requeridos",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El email ya está registrado",
      });
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password);

    // Crear nuevo usuario
    const newUser: User = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      twoFactorEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          id: result.insertedId,
          email: newUser.email,
          name: newUser.name,
          twoFactorEnabled: false,
        },
      },
    });
  } catch (error: any) {
    console.error("Error en signup:", error);

    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("sessionToken");
  res.json({
    success: true,
    message: "Sesión cerrada correctamente",
  });
};
