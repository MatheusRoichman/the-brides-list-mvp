import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "@/env";

import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  client: SQL | undefined;
};

export const client =
  globalForDb.client ??
  new SQL(env.DATABASE_URL, {
    ssl: true,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });