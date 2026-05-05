"use server";

import { desc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export interface ListProductsInput {
  categoryId?: string;
}

export interface ListProductsOutput {
  products: InferSelectModel<typeof products>[];
}

export async function listProducts(
  input: ListProductsInput = {},
): Promise<ListProductsOutput> {
  const rows = await db.query.products.findMany({
    where: input.categoryId
      ? (table, { eq }) => eq(table.category, input.categoryId!)
      : undefined,
    orderBy: [desc(products.createdAt)],
  });

  return { products: rows };
}
