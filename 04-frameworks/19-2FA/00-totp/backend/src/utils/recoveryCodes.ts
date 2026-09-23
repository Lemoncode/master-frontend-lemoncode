import crypto from "crypto";
import bcrypt from "bcryptjs";
import { RecoveryCode } from "../models/User";

export const generateRecoveryCodes = async (
  count: number = 6
): Promise<{ plain: string[]; hashed: RecoveryCode[] }> => {
  const plainCodes: string[] = [];
  const hashedCodes: RecoveryCode[] = [];

  for (let i = 0; i < count; i++) {
    // Generar código aleatorio de 8 caracteres
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    plainCodes.push(code);

    // Hashear el código
    const hashedCode = await bcrypt.hash(code, 10);
    hashedCodes.push({
      code: hashedCode,
      used: false,
    });
  }

  return { plain: plainCodes, hashed: hashedCodes };
};
