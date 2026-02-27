import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export interface RecoveryCode {
  code: string; // Hasheado
  used: boolean;
}

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  recoveryCodes?: RecoveryCode[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  candidatePassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(candidatePassword, hashedPassword);
};
