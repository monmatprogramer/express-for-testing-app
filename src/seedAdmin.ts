import "dotenv/config";
import { db } from "./db";
import { hashPassword } from "./modules/auth/password";

const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = process.env["ADMIN_DEFAULT_EMAIL"];
    const adminPass = process.env["ADMIN_DEFAULT_PASS"];
  } catch (error: unknown) {}
};
