"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Product } from "@/entities";

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
  product: Product;
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

  revalidatePath("/");

  return { product };
}
