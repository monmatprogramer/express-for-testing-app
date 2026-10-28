import bcrypt from "bcryptjs";
import { join } from "node:path";

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
const handleFile = async (): Promise<void> => {
  const filePath = join(__dirname, "message.txt");
  console.log(filePath);
};

handleFile().catch(async (error: unknown) => {
  console.error(error);
});
/*
console.log("Start");
hashPassword("123456")
  .then((result) => console.log(result))
  .catch(async (error) => {
    console.log(error);
  });
console.log("end");
*/
