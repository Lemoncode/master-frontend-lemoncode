import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection";
import { User } from "../models/User";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const db = getDB();
    const usersCollection = db.collection<User>("users");

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
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled || false,
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
