import postgres from "@prisma/orm-postgres/runtime";
import { contractFromJson } from "@prisma/orm-postgres/static";
import type { Contract } from "../prisma/contract";

// 1. Create contract
const contract = contractFromJson<Contract>();
export const db = postgres({ contract });
