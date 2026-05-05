import { listProducts } from "@/services/products/list";
import { listCategories } from "@/services/categories/list";
import { ProductsClient } from "./products-client";

export default async function ProductsPage() {
  const [{ products }, { categories }] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  // Serialize Date objects for client component transfer
  const serializedProducts = products.map((p) => ({
    ...p,
    createdAt: p.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: p.updatedAt?.toISOString() ?? null,
  }));

  const serializedCategories = categories.map((c) => ({
    ...c,
    createdAt: c.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: c.updatedAt?.toISOString() ?? null,
  }));

  return <ProductsClient products={serializedProducts} categories={serializedCategories} />;
}
