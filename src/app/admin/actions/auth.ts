"use server";

import { redirect } from "next/navigation";
import { login as doLogin, logout as doLogout } from "@/lib/admin-auth";

export async function loginAction(
  _prev: { error?: string } | null,
  formData: FormData,
) {
  const password = formData.get("password") as string;
  const ok = await doLogin(password);

  if (!ok) {
    return { error: "Senha incorreta" };
  }

  redirect("/admin/products");
}

export async function logoutAction() {
  await doLogout();
  redirect("/admin/login");
}
