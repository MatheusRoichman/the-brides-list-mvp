"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { products } from "@/db/schema";

export interface DeleteProductInput {
  id: string;
}

export interface DeleteProductOutput {
  id: string;
}

export async function deleteProduct(
  input: DeleteProductInput,
): Promise<DeleteProductOutput> {
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, input.id))
    .returning({ id: products.id });

  if (!deleted) {
    throw new Error(`Product ${input.id} not found`);
  }

  return { id: deleted.id };
}
