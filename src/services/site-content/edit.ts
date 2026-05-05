"use server";

import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { siteContent } from "@/db/schema";

export interface EditSiteContentInput {
  coupleName?: string;
  eventLogoUrl?: string;
  heroDescription?: string;
  eventTimestamp?: Date;
  eventAddressPrimaryLine?: string;
  eventAddressSecondaryLine?: string;
  suggestionsTitle?: string;
  suggestionsText?: string;
  showPrices?: boolean;
  footerTitle?: string;
  footerText?: string;
}

export interface EditSiteContentOutput {
  siteContent: InferSelectModel<typeof siteContent>;
}

export async function editSiteContent(
  input: EditSiteContentInput,
): Promise<EditSiteContentOutput> {
  const existing = await db.query.siteContent.findFirst({
    columns: { id: true },
  });

  if (!existing) {
    throw new Error("Site content does not exist; call createSiteContent first");
  }

  const [updated] = await db
    .update(siteContent)
    .set(input)
    .where(eq(siteContent.id, existing.id))
    .returning();

  return { siteContent: updated };
}
