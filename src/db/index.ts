import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { env } from "@/env";

import * as schema from "./schema";

export const client = new SQL(env.DATABASE_URL, {
  ssl: true,
  prepare: false,
});

export const db = drizzle(client, { schema, casing: "snake_case" });