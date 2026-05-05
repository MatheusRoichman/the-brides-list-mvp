import Image from "next/image";
import { SiteContent } from "@/entities";

interface HeroProps {
  content: SiteContent;
}

export function Hero({ content }: HeroProps) {
  return (
    <header className="relative z-10 pt-[90px] pb-[40px] px-6 text-center max-w-[920px] mx-auto overflow-hidden">
      {/* Decorative Pot Icon */}
      <div className="flex justify-center mb-[28px] animate-in fade-in slide-in-from-top-4 duration-1000">
        <Image 
          src="/assets/bridal-shower-v1/pot.png" 
          alt="Panela com coração" 
          width={110}
          height={110}
          className="w-[110px] h-auto block"
          priority
        />
      </div>

      {/* Eyebrow */}
      <div className="font-['Cormorant_SC'] font-medium tracking-[0.32em] text-[14px] text-[#3f4632] uppercase mb-[18px] animate-in fade-in duration-1000 delay-150">
        Chá de Panela
      </div>

      {/* Main Logo / Names */}
      {content.eventLogoUrl ? (
        <div className="flex justify-center mb-6 animate-in fade-in zoom-in duration-1000 delay-300">
          <Image 
            src={content.eventLogoUrl} 
            alt={content.coupleName} 
            width={560}
            height={200}
            className="block w-[min(560px,92%)] h-auto"
            priority
          />
        </div>
      ) : (
        <div className="flex justify-center mb-6 animate-in fade-in zoom-in duration-1000 delay-300">
          <h1 className="font-['Cormorant_SC'] text-[42px] tracking-[0.22em] text-[#3f4632] uppercase">
            {content.coupleName}
          </h1>
        </div>
      )}

      {/* Heart Divider */}
      <div className="flex items-center justify-center gap-4 mb-6 max-w-[320px] mx-auto animate-in fade-in duration-1000 delay-500">
        <div className="flex-1 h-px bg-[#5a61472e]" />
        <svg className="w-[14px] h-[14px] text-[#3f4632]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="flex-1 h-px bg-[#5a61472e]" />
      </div>

      {/* Description */}
      <div className="font-['Cormorant_Garamond'] italic text-[22px] text-[#3f4632] leading-[1.45] max-w-[580px] mx-auto mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
        {content.heroDescription}
      </div>

      {/* Sub-label */}
      <div className="font-['Cormorant_SC'] text-[13px] tracking-[0.28em] text-[#7c8268] uppercase mt-6 animate-in fade-in duration-1000 delay-900">
        Sugestões de Presentes
      </div>
    </header>
  );
}
