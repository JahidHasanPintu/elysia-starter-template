import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { getDbConfig } from "../lib/utils/env";

const dbConfig = getDbConfig();

export const db = drizzle(dbConfig.DATABASE_URL);
