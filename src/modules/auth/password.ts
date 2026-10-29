import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";

const BCRYPT_COST = 12;
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, BCRYPT_COST);
};

export function createRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}
export const verifyPassword = async (
  inputPasword: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(inputPasword, hashPassword);
};
