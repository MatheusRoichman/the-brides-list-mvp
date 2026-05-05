import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { uuidv7 } from "../columns/uuidv7";
import { products } from "./products";

export const categories = pgTable("categories", {
  id: uuidv7().primaryKey(),
  fullName: text("full_name").notNull(),
  shortName: text("short_name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
