"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { Category } from "@/entities";

import { db } from "@/db";
import { categories } from "@/db/schema";

export interface EditCategoryInput {
  id: string;
  fullName?: string;
  shortName?: string;
}

export interface EditCategoryOutput {
  category: Category;
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

  revalidatePath("/");

  return { category };
}
