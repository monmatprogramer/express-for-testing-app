import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "./prisma/contract.d";
import contractJson from "./prisma/contract.json" with { type: "json" };
// 3. Create a function to get URL of DB
// It has return as String
const requireDatabaseUrl = (): string => {
  // Get Pooler from .env
  const databaseUrl: string | undefined = process.env["DATABASE_URL"];
  if (databaseUrl === undefined || databaseUrl.length === 0) {
    throw new Error("DATABASE_URL is not set.");
  }
  return databaseUrl;
};
// 2. Create database url
export const databaseUrl = requireDatabaseUrl();
// 1. Create contract
export const contract = contractFromJson<Contract>(contractJson);

export const db = postgres({
  contract,
  url: process.env["DATABASE_URL"] ?? process.env["DIRECT_URL"],
});
