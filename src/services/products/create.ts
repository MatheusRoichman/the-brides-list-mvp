"use server";

import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export interface CreateProductInput {
  name: string;
  marketplace: string;
  categoryId: string;
  imageUrl: string;
  minPrice?: string | null;
  maxPrice?: string | null;
}

export interface CreateProductOutput {
  product: InferSelectModel<typeof products>;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<CreateProductOutput> {
  const [product] = await db
    .insert(products)
    .values({
      name: input.name,
      marketplace: input.marketplace,
      category: input.categoryId,
      imageUrl: input.imageUrl,
      minPrice: input.minPrice ?? null,
      maxPrice: input.maxPrice ?? null,
    })
    .returning();

  return { product };
}
