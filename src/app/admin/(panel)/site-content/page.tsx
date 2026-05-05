import { readSiteContent } from "@/services/site-content/read";
import { SiteContentClient } from "./site-content-client";

export default async function SiteContentPage() {
  let siteContent: Parameters<typeof SiteContentClient>[0]["siteContent"] = null;

  try {
    const result = await readSiteContent();

    if (result.siteContent) {
      // Serialize Date objects for the client component
      siteContent = {
        ...result.siteContent,
        eventTimestamp: result.siteContent.eventTimestamp.toISOString(),
        createdAt: result.siteContent.createdAt?.toISOString() ?? new Date().toISOString(),
        updatedAt: result.siteContent.updatedAt?.toISOString() ?? null,
      };
    }
  } catch {
    // If the query fails (e.g. table doesn't exist), show the create form
    siteContent = null;
  }

  return <SiteContentClient siteContent={siteContent} />;
}
