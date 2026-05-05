"use server";

import { asc } from "drizzle-orm";
import { Category } from "@/entities";

import { db } from "@/db";
import { categories } from "@/db/schema";

export type ListCategoriesInput = Record<string, never>;

export interface ListCategoriesOutput {
  categories: Category[];
}

export async function listCategories(): Promise<ListCategoriesOutput> {
  const rows = await db.query.categories.findMany({
    orderBy: [asc(categories.fullName)],
  });

  return { categories: rows };
}
