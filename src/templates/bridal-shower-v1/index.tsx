import { Category, Product, SiteContent } from "@/entities";
import { Hero } from "./hero";
import { DetailsStrip } from "./details-strip";
import { ProductGrid } from "./product-grid";
import { Footer } from "./footer";

interface BridalShowerV1PageProps {
    products: Product[];
    categories: Category[];
    siteContent: SiteContent;
}

export function BridalShowerV1Page({
    products,
    categories,
    siteContent,
}: BridalShowerV1PageProps) {
  return (
    <div className="min-h-screen selection:bg-[#5a61471a]">
      <Hero content={siteContent} />
      
      <DetailsStrip content={siteContent} />

      <ProductGrid
        products={products}
        categories={categories}
        siteContent={siteContent}
      />

      <Footer content={siteContent} />
    </div>
  );
}