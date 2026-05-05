import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/entities";

interface ProductCardProps {
  product: Product;
  showPrices?: boolean;
}

export function ProductCard({ product, showPrices }: ProductCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  const priceLabel = () => {
    if (!product.minPrice) return null;
    if (product.minPrice === product.maxPrice || !product.maxPrice) {
      return formatPrice(product.minPrice);
    }
    return `${formatPrice(product.minPrice)} – ${formatPrice(product.maxPrice)}`;
  };

  return (
    <article className="group relative flex flex-col h-full p-[24px] bg-[#faf9f1] border border-[#5a61471c] transition-all duration-[0.25s] ease-in-out hover:-translate-y-[3px] hover:bg-[#f4f2e6d9] hover:shadow-[0_14px_36px_-22px_rgba(63,70,50,0.4)] overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-[-1px] left-[-1px] w-[16px] h-[16px] border-t border-l border-[#7c8268]" />
      <div className="absolute bottom-[-1px] right-[-1px] w-[16px] h-[16px] border-b border-r border-[#7c8268]" />

      {/* Image Container */}
      <div className="relative w-[100px] h-[100px] mx-auto mb-[28px] flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col gap-[10px] text-center">
        <h3 className="font-['Cormorant_Garamond'] font-medium text-[22px] leading-[1.2] text-[#3f4632]">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="font-['Cormorant_Garamond'] italic text-[15px] leading-[1.45] text-[#7c8268]">
            {product.description}
          </p>
        )}
        
        {showPrices && product.minPrice && (
          <div className="mt-auto pt-[14px] border-t border-dashed border-[#5a61472e] flex justify-between items-center">
            <span className="font-['Cormorant_SC'] text-[13px] tracking-[0.14em] text-[#3f4632] font-medium uppercase">
              Sugestão
            </span>
            <span className="font-['Cormorant_SC'] text-[13px] tracking-[0.14em] text-[#3f4632] font-medium uppercase">
              {priceLabel()}
            </span>
          </div>
        )}
      </div>

      {/* Action Link */}
      <a
        href={product.marketplaceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-[18px] flex items-center justify-center gap-[8px] py-[12px] px-[14px] border border-[#5a6147] text-[#3f4632] font-['Cormorant_SC'] text-[12px] uppercase tracking-[0.22em] transition-all duration-[0.25s] ease-in-out hover:bg-[#5a6147] hover:text-[#f4f2e6]"
      >
        <span>Presentear via {product.marketplace}</span>
        <ArrowRight className="w-[14px] h-[14px] transition-transform group-hover:translate-x-[3px]" />
      </a>
    </article>
  );
}

