import { SiteContent } from "@/entities";

interface FooterProps {
  content: SiteContent;
}

export function Footer({ content }: FooterProps) {
  return (
    <footer className="relative z-10 text-center py-[80px] px-6 pb-[90px] max-w-[720px] mx-auto border-t border-[#5a61472e]">
      <div className="flex justify-center gap-[6px] mb-[24px] text-[#7c8268]">
        <svg className="w-[28px] h-[46px] -rotate-[25deg]" viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g fill="currentColor" opacity="0.55">
            <path d="M30 8 c-12 8-22 24-22 42 c0 18 10 38 22 42 c12-4 22-24 22-42 c0-18-10-34-22-42 z M30 18 c8 6 14 18 14 32 c0 14-6 28-14 32 z" fillRule="evenodd"/>
            <path d="M28 22 l4 0 0 60 -4 0 z"/>
          </g>
        </svg>
        <svg className="w-[28px] h-[46px]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 21 c-7-5-10-9-10-13 c0-3 2.5-5.5 5.5-5.5 c2 0 3.5 1 4.5 2.5 c1-1.5 2.5-2.5 4.5-2.5 c3 0 5.5 2.5 5.5 5.5 c0 4-3 8-10 13 z" fill="currentColor"/>
        </svg>
        <svg className="w-[28px] h-[46px] rotate-[25deg]" viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g fill="currentColor" opacity="0.55">
            <path d="M30 8 c-12 8-22 24-22 42 c0 18 10 38 22 42 c12-4 22-24 22-42 c0-18-10-34-22-42 z M30 18 c8 6 14 18 14 32 c0 14-6 28-14 32 z" fillRule="evenodd"/>
            <path d="M28 22 l4 0 0 60 -4 0 z"/>
          </g>
        </svg>
      </div>

      <h2 className="font-['Pinyon_Script'] font-normal text-[44px] text-[#3f4632] leading-[1.1] mb-[18px]">
        {content.footerTitle}
      </h2>
      
      <div className="space-y-[8px] mb-[28px]">
        {content.footerText.split("\n").map((line, i) => (
          <p key={i} className="font-['Cormorant_Garamond'] italic text-[18px] text-[#5a6147]">
            {line}
          </p>
        ))}
      </div>

      <div className="font-['Cormorant_SC'] text-[12px] tracking-[0.32em] text-[#7c8268] uppercase">
        {content.coupleName}
      </div>
    </footer>
  );
}

