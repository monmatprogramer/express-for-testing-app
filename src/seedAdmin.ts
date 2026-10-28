import "dotenv/config";
import { db } from "./db";
import { hashPassword } from "./modules/auth/password";

const seedAdmin = async (): Promise<void> => {
  try {
    const adminEmail = process.env["ADMIN_DEFAULT_EMAIL"];
    const adminPass = process.env["ADMIN_DEFAULT_PASS"];
    //Check admin info
    if (!adminEmail || !adminPass) {
      throw new Error("Fill admin info");
    }
    // Check for existing gmail
    const existingUser = await db.orm.public.User.where({
      email: adminEmail,
    }).first();
    if (existingUser) {
      console.log("Already exist.");
      return;
    }
    const passwordHash = await hashPassword(adminPass!);

    const newAdmin = await db.orm.public.User.create({
      name: "Super Admin",
      phone: "070836110",
      email: adminEmail,
      passwordHash: passwordHash,
      role: "ADMIN",
    });
    console.log("Admin successfully seed.");
    console.log("Admin info: ", newAdmin);
  } catch (error: unknown) {
    console.error("Error during admin seeding: ", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

seedAdmin();
