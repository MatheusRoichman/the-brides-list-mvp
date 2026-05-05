import { listProducts } from "@/services/products/list";
import { listCategories } from "@/services/categories/list";
import { readSiteContent } from "@/services/site-content/read";
import { BridalShowerV1Page } from "@/templates/bridal-shower-v1";

export const revalidate = false; // Page is static, revalidated via revalidatePath

export async function generateMetadata() {
  const { siteContent } = await readSiteContent();
  
  if (!siteContent) return {};

  return {
    title: `${siteContent.coupleName} | Chá de Panela`,
    description: siteContent.heroDescription,
  };
}


export default async function Home() {
  const [
    { products },
    { categories },
    { siteContent }
  ] = await Promise.all([
    listProducts(),
    listCategories(),
    readSiteContent(),
  ]);

  if (!siteContent) {
    return (
      <div className="min-h-screen flex items-center justify-center font-heading text-2xl text-admin-ink italic">
        Site em manutenção. Volte em breve.
      </div>
    );
  }

  return (
    <BridalShowerV1Page
      products={products}
      categories={categories}
      siteContent={siteContent}
    />
  );
}
