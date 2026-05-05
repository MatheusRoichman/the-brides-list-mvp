"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin-auth";

import { createCategory } from "@/services/categories/create";
import { editCategory } from "@/services/categories/edit";
import { deleteCategory } from "@/services/categories/delete";

export async function createCategoryAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  await requireAuth();

  try {
    await createCategory({
      fullName: formData.get("fullName") as string,
      shortName: formData.get("shortName") as string,
    });

    revalidatePath("/admin/categories");

    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao criar categoria" };
  }
}

export async function editCategoryAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  await requireAuth();
  try {
    await editCategory({
      id: formData.get("id") as string,
      fullName: (formData.get("fullName") as string) || undefined,
      shortName: (formData.get("shortName") as string) || undefined,
    });
    revalidatePath("/admin/categories");
    return null;
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao editar categoria" };
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAuth();
  await deleteCategory({ id: formData.get("id") as string });
  revalidatePath("/admin/categories");
}
