"use client";

import { cn } from "@/lib/utils";
import { Category } from "@/entities";

interface NavbarProps {
  categories: Category[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: string;
}

export function Navbar({ categories, searchQuery, setSearchQuery, activeSection }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-[50] bg-[#eef0e3eb] backdrop-blur-[8px] border-b border-[#5a61472e]">

      {/* Search Section */}
      <div className="max-w-[620px] mx-auto px-6 pt-[16px] pb-[10px]">
        <label className="block mb-[8px] font-['Cormorant_SC'] text-[11px] tracking-[0.24em] text-[#7c8268] text-center uppercase">
          buscar presente
        </label>

        <div className="relative group">
          <input 
            type="search" 
            placeholder="digite o que procura..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[46px] px-[16px] py-[10px] text-center text-[#3f4632] bg-[#faf9f1b8] border border-[#5a61472e] rounded-none outline-none focus:border-[#5a61477a] transition-colors placeholder:italic placeholder:opacity-60 font-['Cormorant_Garamond'] text-lg"
          />
        </div>
      </div>


      {/* Category Links */}
      <div className="max-w-[1100px] mx-auto flex justify-center flex-wrap gap-x-[28px] gap-y-[6px] px-6 pb-[14px]">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className={cn(
              "font-['Cormorant_SC'] text-[11px] tracking-[0.22em] text-[#3f4632] uppercase transition-all hover:opacity-70",
              activeSection === category.id && "underline underline-offset-[6px] decoration-[#5a61475e]"
            )}
          >
            {category.shortName}
          </a>
        ))}
      </div>
    </nav>
  );
}

