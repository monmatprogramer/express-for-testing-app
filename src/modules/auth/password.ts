import bcrypt from "bcryptjs";

const BCRYPT_COST = 12;
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, BCRYPT_COST);
};

export const verifyPassword = async (
  inputPasword: string,
  hashPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(inputPasword, hashPassword);
};
