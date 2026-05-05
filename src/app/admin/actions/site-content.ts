"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/admin-auth";

import { createSiteContent } from "@/services/site-content/create";
import { editSiteContent } from "@/services/site-content/edit";

export async function saveSiteContentAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
) {
  await requireAuth();

  const isCreate = formData.get("_action") === "create";

  const data = {
    coupleName: formData.get("coupleName") as string,
    eventLogoUrl: formData.get("eventLogoUrl") as string,
    heroDescription: formData.get("heroDescription") as string,
    eventTimestamp: new Date(formData.get("eventTimestamp") as string),
    eventAddressPrimaryLine: formData.get("eventAddressPrimaryLine") as string,
    eventAddressSecondaryLine: formData.get("eventAddressSecondaryLine") as string,
    suggestionsTitle: formData.get("suggestionsTitle") as string,
    suggestionsText: formData.get("suggestionsText") as string,
    showPrices: formData.get("showPrices") === "on",
    footerTitle: formData.get("footerTitle") as string,
    footerText: formData.get("footerText") as string,
  };

  try {
    if (isCreate) {
      await createSiteContent(data);
    } else {
      await editSiteContent(data);
    }

    revalidatePath("/admin/site-content");
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Erro ao salvar conteúdo" };
  }
}
