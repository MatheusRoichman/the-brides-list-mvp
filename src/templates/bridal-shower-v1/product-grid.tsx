"use client";

import { useMemo, useState, useEffect } from "react";
import { Product, Category, SiteContent } from "@/entities";
import { Navbar } from "./navbar";
import { ProductCard } from "./product-card";
import { ReservationDialog, SuccessScreen } from "./reservation-dialog";
import { MyReservations } from "./my-reservations";

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  siteContent: SiteContent;
}

export function ProductGrid({ products, categories, siteContent }: ProductGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  const normalizeText = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const filteredProducts = useMemo(() => {
    const query = normalizeText(searchQuery);
    if (!query) return products;

    return products.filter((p) => {
      return (
        normalizeText(p.name).includes(query) ||
        normalizeText(p.marketplace).includes(query)
      );
    });
  }, [products, searchQuery]);

  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <>
      <section className="pt-24 pb-12 px-6 text-center max-w-[840px] mx-auto animate-in fade-in duration-1000">
        <div className="font-['Cormorant_SC'] text-[11px] tracking-[0.24em] text-[#7c8268] uppercase mb-4">
          Lista de Sugestões
        </div>
        <h2 className="font-['Pinyon_Script'] text-[56px] text-[#3f4632] leading-tight mb-8">
          {siteContent.suggestionsTitle || 'com amor, escolhemos'}
        </h2>
        <div className="space-y-4 max-w-[640px] mx-auto">
          {siteContent.suggestionsText.split('\n').map((para, i) => (
            <p key={i} className="font-['Cormorant_Garamond'] italic text-lg leading-relaxed text-[#5a6147]">
              {para}
            </p>
          ))}
        </div>
      </section>

      <Navbar
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSection={activeSection}
      />

      <MyReservations />

      <main className="max-w-7xl mx-auto px-4 py-16 space-y-24 min-h-screen">
        {categories.map((category) => {
          const categoryProducts = groupedProducts[category.id];
          if (!categoryProducts || categoryProducts.length === 0) return null;

          return (
            <section key={category.id} id={category.id} className="scroll-mt-40">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="font-['Pinyon_Script'] font-normal text-[52px] text-[#3f4632] leading-none lowercase">
                  {category.fullName}
                </h2>
                <div className="flex-1 h-px bg-[#5a61472e] opacity-80" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    showPrices={siteContent.showPrices} 
                    onReserve={setSelectedProduct}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="font-['Cormorant_Garamond'] text-3xl text-[#5a6147] italic">
              Nenhum presente encontrado com esse termo.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#7c8268] uppercase font-['Cormorant_SC'] text-xs tracking-widest border-b border-[#5a61472e] hover:text-[#3f4632] transition-colors"
            >
              limpar busca
            </button>
          </div>
        )}
      </main>

      {selectedProduct && !successToken && (
        <ReservationDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSuccess={setSuccessToken}
        />
      )}

      {selectedProduct && successToken && (
        <SuccessScreen
          product={selectedProduct}
          token={successToken}
          onClose={() => {
            setSelectedProduct(null);
            setSuccessToken(null);
          }}
        />
      )}
    </>
  );
}

