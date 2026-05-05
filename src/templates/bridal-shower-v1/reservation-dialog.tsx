"use client";

import { useState } from "react";
import { Product } from "@/entities";
import { createReservationAction } from "@/app/actions/reservations";
import { Check, Copy, ExternalLink, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ReservationDialogProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

export function ReservationDialog({ product, onClose, onSuccess }: ReservationDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createReservationAction(formData);

    if (result.success) {
      const token = result.token;
      // Save to localStorage
      const stored = localStorage.getItem("tbl:reservations");
      const reservations = stored ? JSON.parse(stored) : [];
      reservations.push({ productId: product!.id, token });
      localStorage.setItem("tbl:reservations", JSON.stringify(reservations));
      
      onSuccess(token);
    } else {
      if (result.error === "already_reserved") {
        setError("Este presente acabou de ser reservado por outra pessoa.");
      } else {
        setError("Ocorreu um erro ao reservar o presente. Tente novamente.");
      }
      setIsPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3f463266] backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-[#faf9f1] border border-[#5a61474d] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7c8268] hover:text-[#3f4632] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="font-['Cormorant_SC'] text-[10px] tracking-[0.2em] text-[#7c8268] uppercase mb-2">
            Reservar Presente
          </div>
          <h2 className="font-['Pinyon_Script'] text-4xl text-[#3f4632] mb-4">
            {product.name}
          </h2>
          <p className="font-['Cormorant_Garamond'] italic text-[#5a6147] text-lg">
            Ao reservar, você garante que ninguém mais dará este mesmo presente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="productId" value={product.id} />
          
          <div className="space-y-1.5">
            <label htmlFor="reserverName" className="font-['Cormorant_SC'] text-[11px] tracking-widest text-[#3f4632] uppercase">
              Seu Nome *
            </label>
            <input
              id="reserverName"
              name="reserverName"
              required
              className="w-full bg-transparent border-b border-[#5a61474d] py-2 font-['Cormorant_Garamond'] text-lg focus:outline-none focus:border-[#5a6147] transition-colors"
              placeholder="Como os noivos te chamam?"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="whatsapp" className="font-['Cormorant_SC'] text-[11px] tracking-widest text-[#3f4632] uppercase">
              WhatsApp (Opcional)
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              className="w-full bg-transparent border-b border-[#5a61474d] py-2 font-['Cormorant_Garamond'] text-lg focus:outline-none focus:border-[#5a6147] transition-colors"
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="message" className="font-['Cormorant_SC'] text-[11px] tracking-widest text-[#3f4632] uppercase">
              Mensagem para os noivos (Opcional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full bg-transparent border border-[#5a61472e] p-3 font-['Cormorant_Garamond'] text-lg focus:outline-none focus:border-[#5a6147] transition-colors resize-none"
              placeholder="Deixe um recado carinhoso..."
            />
          </div>

          {error && (
            <p className="text-sm font-['Cormorant_Garamond'] text-red-700 italic bg-red-50 p-3 border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-[#3f4632] text-[#f4f2e6] font-['Cormorant_SC'] text-xs uppercase tracking-[0.25em] transition-all hover:bg-[#5a6147] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Confirmar Reserva"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

interface SuccessScreenProps {
  product: Product;
  token: string;
  onClose: () => void;
}

export function SuccessScreen({ product, token, onClose }: SuccessScreenProps) {
  const cancelUrl = typeof window !== 'undefined' ? `${window.location.origin}/cancel/${token}` : '';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cancelUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#3f463266] backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-[#faf9f1] border border-[#5a61474d] p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-[#3f4632] flex items-center justify-center text-[#f4f2e6]">
            <Check size={32} />
          </div>
        </div>

        <h2 className="font-['Pinyon_Script'] text-5xl text-[#3f4632] mb-4">
          Obrigada!
        </h2>
        
        <p className="font-['Cormorant_Garamond'] text-lg text-[#5a6147] mb-8 italic">
          Sua reserva para <strong>{product.name}</strong> foi realizada com sucesso. Os noivos ficarão muito felizes!
        </p>

        <div className="p-6 bg-[#f4f2e6] border border-[#5a61472e] rounded-sm space-y-4 mb-8">
          <p className="font-['Cormorant_SC'] text-[10px] tracking-widest text-[#7c8268] uppercase">
            Link para cancelamento
          </p>
          <p className="text-[11px] font-mono break-all text-[#3f4632] opacity-70">
            {cancelUrl}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-[#5a61472e] font-['Cormorant_SC'] text-[10px] uppercase tracking-widest text-[#3f4632] hover:bg-[#faf9f1] transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copiado" : "Copiar Link"}
            </button>
          </div>
          <p className="text-[10px] font-['Cormorant_Garamond'] italic text-[#7c8268]">
            Dica: Tire um print desta tela ou salve o link caso precise cancelar a reserva depois.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href={product.marketplaceLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#3f4632] text-[#f4f2e6] font-['Cormorant_SC'] text-xs uppercase tracking-[0.25em] transition-all hover:bg-[#5a6147] flex items-center justify-center gap-2"
          >
            Ir para a loja <ExternalLink size={14} />
          </a>
          
          <button
            onClick={onClose}
            className="w-full py-3 border border-[#5a61472e] text-[#7c8268] font-['Cormorant_SC'] text-[10px] uppercase tracking-[0.25em] transition-all hover:text-[#3f4632]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
