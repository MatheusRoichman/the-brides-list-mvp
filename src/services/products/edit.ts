"use server";

import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export interface EditProductInput {
  id: string;
  name?: string;
  marketplace?: string;
  marketplaceLink?: string;
  categoryId?: string;
  imageUrl?: string;
  minPrice?: string | null;
  maxPrice?: string | null;
}

export interface EditProductOutput {
  product: InferSelectModel<typeof products>;
}

export async function editProduct(
  input: EditProductInput,
): Promise<EditProductOutput> {
  const { id, categoryId, ...rest } = input;

  const [product] = await db
    .update(products)
    .set({
      ...rest,
      ...(categoryId !== undefined ? { category: categoryId } : {}),
    })
    .where(eq(products.id, id))
    .returning();

  if (!product) {
    throw new Error(`Product ${id} not found`);
  }

  return { product };
}
