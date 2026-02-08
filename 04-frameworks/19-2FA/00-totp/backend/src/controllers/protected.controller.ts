import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection";
import { User } from "../models/User";

export const getProtectedData = async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario autenticado
    const user = await usersCollection.findOne({
      _id: new ObjectId(req.userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Sólo puedes leer esto si estás autenticado",
      data: {
        user: {
          name: user.name,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled || false,
        },
        timestamp: new Date().toISOString(),
        secretMessage: "¡Felicidades! Has accedido a un recurso protegido.",
      },
    });
  } catch (error) {
    console.error("Error en endpoint protegido:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
