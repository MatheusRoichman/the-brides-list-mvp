"use server";

import { SiteContent } from "@/entities";

import { db } from "@/db";
import { siteContent } from "@/db/schema";

export interface ReadSiteContentOutput {
  siteContent: SiteContent | null;
}

export async function readSiteContent(): Promise<ReadSiteContentOutput> {
  const row = await db.query.siteContent.findFirst();
  return { siteContent: row ?? null };
}
