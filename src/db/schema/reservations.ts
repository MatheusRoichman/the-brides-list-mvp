import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { uuidv7 } from "../columns/uuidv7";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const reservations = pgTable(
  "reservations",
  {
    id: uuidv7().primaryKey(),
    productId: uuidv7("product_id")
      .notNull()
      .unique()
      .references(() => products.id, { onDelete: "cascade" }),
    reserverName: text("reserver_name").notNull(),
    whatsapp: text("whatsapp"),
    message: text("message"),
    cancellationToken: text("cancellation_token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    cancellationIdx: uniqueIndex("cancellation_token_idx").on(
      table.cancellationToken
    ),
  })
);

export const reservationsRelations = relations(reservations, ({ one }) => ({
  product: one(products, {
    fields: [reservations.productId],
    references: [products.id],
  }),
}));
