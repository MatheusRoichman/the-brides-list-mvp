import { uuid } from "drizzle-orm/pg-core";

export function uuidv7(name?: string) {
  const column = name ? uuid(name) : uuid();
  return column.$defaultFn(() => Bun.randomUUIDv7());
}
