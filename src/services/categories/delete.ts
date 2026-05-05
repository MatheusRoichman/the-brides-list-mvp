"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";

export interface DeleteCategoryInput {
  id: string;
}

export interface DeleteCategoryOutput {
  id: string;
}

export async function deleteCategory(
  input: DeleteCategoryInput,
): Promise<DeleteCategoryOutput> {
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, input.id))
    .returning({ id: categories.id });

  if (!deleted) {
    throw new Error(`Category ${input.id} not found`);
  }

  return { id: deleted.id };
}
