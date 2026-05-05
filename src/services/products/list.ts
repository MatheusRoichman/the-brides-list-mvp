"use server";

import { desc } from "drizzle-orm";
import { Product } from "@/entities";

import { db } from "@/db";
import { products } from "@/db/schema";

export interface ListProductsInput {
  categoryId?: string;
}

export interface ListProductsOutput {
  products: Product[];
}

export async function listProducts(
  input: ListProductsInput = {},
): Promise<ListProductsOutput> {
  const rows = await db.query.products.findMany({
    with: {
      reservation: true,
    },
    where: input.categoryId
      ? (table, { eq }) => eq(table.category, input.categoryId!)
      : undefined,
    orderBy: [desc(products.createdAt)],
  });

  // Filter out products that have a reservation
  // The user said "Filter at the query level... reserved products must never appear in the response payload"
  // If I use findMany with `with`, they still appear in the payload if they exist.
  // I should use the core `db.select()` to do a proper LEFT JOIN.

  const { products: productsTable, reservations: reservationsTable } = await import("@/db/schema");
  const { isNull, eq, and } = await import("drizzle-orm");

  const query = db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      marketplace: productsTable.marketplace,
      marketplaceLink: productsTable.marketplaceLink,
      category: productsTable.category,
      imageUrl: productsTable.imageUrl,
      minPrice: productsTable.minPrice,
      maxPrice: productsTable.maxPrice,
      createdAt: productsTable.createdAt,
      updatedAt: productsTable.updatedAt,
    })
    .from(productsTable)
    .leftJoin(reservationsTable, eq(productsTable.id, reservationsTable.productId))
    .where(
      and(
        isNull(reservationsTable.id),
        input.categoryId ? eq(productsTable.category, input.categoryId) : undefined
      )
    )
    .orderBy(desc(productsTable.createdAt));

  const results = await query;

  return { products: results };
}
