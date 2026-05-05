"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin-auth";

import { createProduct } from "@/services/products/create";
import { editProduct } from "@/services/products/edit";
import { deleteProduct } from "@/services/products/delete";

export async function createProductAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  await requireAuth();

  try {
    await createProduct({
      name: formData.get("name") as string,
      marketplace: formData.get("marketplace") as string,
      marketplaceLink: formData.get("marketplaceLink") as string,
      categoryId: formData.get("categoryId") as string,
      imageUrl: formData.get("imageUrl") as string,
      minPrice: (formData.get("minPrice") as string) || null,
      maxPrice: (formData.get("maxPrice") as string) || null,
    });

    revalidatePath("/admin/products");

    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao criar produto" };
  }
}

export async function editProductAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  await requireAuth();

  try {
    await editProduct({
      id: formData.get("id") as string,
      name: (formData.get("name") as string) || undefined,
      marketplace: (formData.get("marketplace") as string) || undefined,
      marketplaceLink: (formData.get("marketplaceLink") as string) || undefined,
      categoryId: (formData.get("categoryId") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      minPrice: formData.has("minPrice") ? (formData.get("minPrice") as string) || null : undefined,
      maxPrice: formData.has("maxPrice") ? (formData.get("maxPrice") as string) || null : undefined,
    });

    revalidatePath("/admin/products");

    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao editar produto" };
  }
}

export async function deleteProductAction(formData: FormData) {
  await requireAuth();

  await deleteProduct({ id: formData.get("id") as string });

  revalidatePath("/admin/products");
}
