"use server";

import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { siteContent } from "@/db/schema";

export interface CreateSiteContentInput {
  coupleName: string;
  eventLogoUrl: string;
  heroDescription: string;
  eventTimestamp: Date;
  eventAddressPrimaryLine: string;
  eventAddressSecondaryLine: string;
  suggestionsTitle: string;
  suggestionsText: string;
  showPrices?: boolean;
  footerTitle: string;
  footerText: string;
}

export interface CreateSiteContentOutput {
  siteContent: InferSelectModel<typeof siteContent>;
}

export async function createSiteContent(
  input: CreateSiteContentInput,
): Promise<CreateSiteContentOutput> {
  const existing = await db.query.siteContent.findFirst({
    columns: { id: true },
  });

  if (existing) {
    throw new Error("Site content already exists; use editSiteContent instead");
  }

  const [created] = await db
    .insert(siteContent)
    .values({
      coupleName: input.coupleName,
      eventLogoUrl: input.eventLogoUrl,
      heroDescription: input.heroDescription,
      eventTimestamp: input.eventTimestamp,
      eventAddressPrimaryLine: input.eventAddressPrimaryLine,
      eventAddressSecondaryLine: input.eventAddressSecondaryLine,
      suggestionsTitle: input.suggestionsTitle,
      suggestionsText: input.suggestionsText,
      showPrices: input.showPrices ?? false,
      footerTitle: input.footerTitle,
      footerText: input.footerText,
    })
    .returning();

  return { siteContent: created };
}
