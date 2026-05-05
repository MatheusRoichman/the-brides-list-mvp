import { numeric, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { uuidv7 } from "../columns/uuidv7";
import { relations } from "drizzle-orm";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: uuidv7().primaryKey(),
  name: text("name").notNull(),
  marketplace: text("marketplace").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  minPrice: numeric("min_price", { precision: 10, scale: 2 }),
  maxPrice: numeric("max_price", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.category],
    references: [categories.id],
  }),
}));