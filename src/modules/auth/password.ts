import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
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
  const textToWrite = "New This is first text to be writen in message.txt";
  try {
    await writeFile(filePath, textToWrite, "utf-8");
    console.log("File written successfully!");
    const data = await readFile(filePath, "utf-8");
    console.log(data);
  } catch (error) {
    console.error("Error from handleFile() : ", error);
  }
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
