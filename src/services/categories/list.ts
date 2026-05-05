"use server";

import { asc } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";

export type ListCategoriesInput = Record<string, never>;

export interface ListCategoriesOutput {
  categories: InferSelectModel<typeof categories>[];
}

export async function listCategories(): Promise<ListCategoriesOutput> {
  const rows = await db.query.categories.findMany({
    orderBy: [asc(categories.fullName)],
  });

  return { categories: rows };
}
