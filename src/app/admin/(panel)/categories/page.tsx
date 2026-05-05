import { listCategories } from "@/services/categories/list";
import { CategoriesClient } from "./categories-client";

export default async function CategoriesPage() {
  const { categories } = await listCategories();

  // Serialize Date objects for client component transfer
  const serializedCategories = categories.map((c) => ({
    ...c,
    createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: c.updatedAt?.toISOString() ?? null,
  }));

  return <CategoriesClient categories={serializedCategories} />;
}
