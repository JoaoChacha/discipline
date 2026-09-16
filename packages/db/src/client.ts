import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL");
}

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);
const isTransactionPooler = connectionString.includes(":6543");

const client = postgres(connectionString, {
  ssl: isLocal ? undefined : "require",
  prepare: !isTransactionPooler,
});

export const db = drizzle({
  client,
  schema,
  casing: "snake_case",
});
