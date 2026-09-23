import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection";
import { User } from "../models/User";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { generateSessionToken, verifyTempToken } from "../middleware/auth";
import { generateRecoveryCodes } from "../utils/recoveryCodes";
import { encrypt, decrypt } from "../utils/encryption";

export const setup2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Generar secret
    const secret = new OTPAuth.Secret({ size: 20 });

    // Crear TOTP
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });

    // Generar URL otpauth
    const otpauthUrl = totp.toString();

    // Generar QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Guardar el secret encriptado en la base de datos (aún no habilitado)
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          twoFactorSecret: encrypt(secret.base32),
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
      },
    });
  } catch (error) {
    console.error("Error en setup 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

export const verify2FA = async (req: Request, res: Response) => {
  try {
    const { tempToken, code } = req.body;

    if (!tempToken || !code) {
      return res.status(400).json({
        success: false,
        message: "tempToken y código son requeridos",
      });
    }

    // Verificar el token temporal
    const decoded = verifyTempToken(tempToken);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token temporal inválido o expirado",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "2FA no configurado para este usuario",
      });
    }

    // Primero intentar validar como código TOTP
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(decrypt(user.twoFactorSecret)),
    });

    const delta = totp.validate({ token: code, window: 1 });

    // Si es un código TOTP válido
    if (delta !== null) {
      const sessionToken = generateSessionToken(user._id!.toString());

      // Establecer cookie httpOnly
      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, // 1 hora
      });

      return res.json({
        success: true,
        message: "Código verificado correctamente",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            twoFactorEnabled: true,
          },
        },
      });
    }

    // Si no es TOTP, intentar con recovery codes
    if (user.recoveryCodes && user.recoveryCodes.length > 0) {
      for (let i = 0; i < user.recoveryCodes.length; i++) {
        const recoveryCode = user.recoveryCodes[i];

        // Saltar si el código no existe o ya fue usado
        if (!recoveryCode || recoveryCode.used) {
          continue;
        }

        // Verificar si el código coincide
        const isMatch = await bcrypt.compare(code, recoveryCode.code);

        if (isMatch) {
          // Marcar el código como usado
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                [`recoveryCodes.${i}.used`]: true,
                updatedAt: new Date(),
              },
            }
          );

          const sessionToken = generateSessionToken(user._id!.toString());

          // Establecer cookie httpOnly
          res.cookie("sessionToken", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hora
          });

          return res.json({
            success: true,
            message: "Código de recuperación verificado correctamente",
            data: {
              isRecoveryCode: true,
              user: {
                id: user._id,
                email: user.email,
                name: user.name,
                twoFactorEnabled: true,
              },
            },
          });
        }
      }
    }

    // Si llegamos aquí, ni TOTP ni recovery code fueron válidos
    return res.status(401).json({
      success: false,
      message: "Código incorrecto o expirado",
    });
  } catch (error) {
    console.error("Error en verificación 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};

export const enable2FA = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { code } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Usuario no autenticado",
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Código es requerido",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "Primero debes generar el código QR",
      });
    }

    // Crear TOTP con el secret del usuario (desencriptado)
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(decrypt(user.twoFactorSecret)),
    });

    // Validar el código
    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      return res.status(401).json({
        success: false,
        message: "Código incorrecto o expirado",
      });
    }

    // Generar recovery codes
    const { plain: plainRecoveryCodes, hashed: hashedRecoveryCodes } =
      await generateRecoveryCodes(6);

    // Habilitar 2FA y guardar recovery codes
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          twoFactorEnabled: true,
          recoveryCodes: hashedRecoveryCodes,
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: "Autenticación de dos factores habilitada correctamente",
      data: {
        recoveryCodes: plainRecoveryCodes,
      },
    });
  } catch (error) {
    console.error("Error al habilitar 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
};
