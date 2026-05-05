"use server";

import { revalidatePath } from "next/cache";
import { Category } from "@/entities";

import { db } from "@/db";
import { categories } from "@/db/schema";

export interface CreateCategoryInput {
  fullName: string;
  shortName: string;
}

export interface CreateCategoryOutput {
  category: Category;
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<CreateCategoryOutput> {

  const [category] = await db
    .insert(categories)
    .values({
      fullName: input.fullName,
      shortName: input.shortName,
    })
    .returning();

  revalidatePath("/");

  return { category };
}
