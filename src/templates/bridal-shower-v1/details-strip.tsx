import { SiteContent } from "@/entities";

interface DetailsStripProps {
  content: SiteContent;
}

export function DetailsStrip({ content }: DetailsStripProps) {
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(content.eventTimestamp);

  const weekday = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(content.eventTimestamp);

  const formattedTime = `${content.eventTimestamp.getHours().toString().padStart(2, '0')}h`;

  return (
    <section className="relative z-10 flex justify-center flex-wrap gap-x-[56px] gap-y-8 py-[36px] px-6 pb-[40px] max-w-[920px] mx-auto animate-in fade-in duration-1000">

      {/* Quando */}
      <div className="flex items-start gap-4">
        <div className="w-[44px] h-[44px] text-[#7c8268] opacity-80">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M14 22 l72 0 c2 0 3 1.5 3 3.5 l0 60 c0 2-1 3.5-3 3.5 l-72 0 c-2 0-3-1.5-3-3.5 l0-60 c0-2 1-3.5 3-3.5 z M16 38 l68 0 0 48 -68 0 z" fillRule="evenodd"/>
            <rect x="24" y="11" width="6" height="18" rx="2"/>
            <rect x="70" y="11" width="6" height="18" rx="2"/>
            <path d="M50 76 c-9-7-16-12-16-20 c0-5 4-9 9-9 c3 0 5.5 1.5 7 4 c1.5-2.5 4-4 7-4 c5 0 9 4 9 9 c0 8-7 13-16 20 z" fill="#fff"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-['Cormorant_SC'] text-[11px] tracking-[0.24em] text-[#7c8268] uppercase mb-1">Quando</span>
          <span className="font-['Cormorant_SC'] text-[16px] tracking-[0.05em] text-[#3f4632] uppercase font-medium">{formattedDate}</span>
          <span className="font-['Cormorant_Garamond'] italic text-[14px] text-[#7c8268] capitalize">{weekday}, {formattedTime}</span>
        </div>
      </div>

      {/* Onde */}
      <div className="flex items-start gap-4">
        <div className="w-[44px] h-[44px] text-[#7c8268] opacity-80">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M50 8 c-16 0-29 13-29 29 c0 22 29 55 29 55 s29-33 29-55 c0-16-13-29-29-29 z" />
            <path d="M50 56 c-7-5.5-13-9.5-13-15.5 c0-4 3-7 7-7 c2.5 0 4.5 1 6 3 c1.5-2 3.5-3 6-3 c4 0 7 3 7 7 c0 6-6 10-13 15.5 z" fill="#fff"/>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-['Cormorant_SC'] text-[11px] tracking-[0.24em] text-[#7c8268] uppercase mb-1">Onde</span>
          <span className="font-['Cormorant_SC'] text-[16px] tracking-[0.05em] text-[#3f4632] uppercase font-medium">{content.eventAddressPrimaryLine}</span>
          <span className="font-['Cormorant_Garamond'] italic text-[14px] text-[#7c8268]">{content.eventAddressSecondaryLine}</span>
        </div>
      </div>
    </section>
  );
}
