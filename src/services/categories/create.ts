"use server";

import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";

export interface CreateCategoryInput {
  fullName: string;
  shortName: string;
}

export interface CreateCategoryOutput {
  category: InferSelectModel<typeof categories>;
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

  return { category };
}
