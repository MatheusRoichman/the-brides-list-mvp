"use server";

import type { InferSelectModel } from "drizzle-orm";

import { db } from "@/db";
import { siteContent } from "@/db/schema";

export interface ReadSiteContentOutput {
  siteContent: InferSelectModel<typeof siteContent> | null;
}

export async function readSiteContent(): Promise<ReadSiteContentOutput> {
  const row = await db.query.siteContent.findFirst();
  return { siteContent: row ?? null };
}
