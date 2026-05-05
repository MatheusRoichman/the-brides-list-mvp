"use server";

import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";

export interface EditCategoryInput {
  id: string;
  fullName?: string;
  shortName?: string;
}

export interface EditCategoryOutput {
  category: InferSelectModel<typeof categories>;
}

export async function editCategory(
  input: EditCategoryInput,
): Promise<EditCategoryOutput> {
  const { id, ...rest } = input;

  const [category] = await db
    .update(categories)
    .set(rest)
    .where(eq(categories.id, id))
    .returning();

  if (!category) {
    throw new Error(`Category ${id} not found`);
  }

  return { category };
}
