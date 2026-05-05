"use client";

import { useState } from "react";
import { cancelReservationAction } from "@/app/actions/reservations";
import { useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface CancelConfirmationProps {
  token: string;
  productName: string;
}

export function CancelConfirmation({ token, productName }: CancelConfirmationProps) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleCancel() {
    setIsPending(true);
    const result = await cancelReservationAction(token);

    if (result.success) {
      // Remove from localStorage if it's there
      const stored = localStorage.getItem("tbl:reservations");
      if (stored) {
        const entries = JSON.parse(stored);
        const filtered = entries.filter((e: any) => e.token !== token);
        localStorage.setItem("tbl:reservations", JSON.stringify(filtered));
      }

      toast.success("Reserva cancelada com sucesso.");
      router.push("/?cancelled=true");
    } else {
      toast.error("Erro ao cancelar reserva. Tente novamente.");
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-[#faf9f1] border border-[#5a61474d] p-10 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
          <AlertTriangle size={32} />
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="font-['Cormorant_SC'] text-xs tracking-[0.25em] text-[#7c8268] uppercase">
          Confirmar Cancelamento
        </h1>
        <h2 className="font-['Pinyon_Script'] text-5xl text-[#3f4632] lowercase">
          {productName}
        </h2>
        <p className="font-['Cormorant_Garamond'] text-lg text-[#5a6147] italic leading-relaxed">
          Tem certeza que deseja cancelar sua reserva para este presente?
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="w-full py-4 bg-red-700 text-white font-['Cormorant_SC'] text-xs uppercase tracking-[0.25em] transition-all hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Sim, cancelar reserva"
          )}
        </button>
        
        <button
          onClick={() => router.push("/")}
          disabled={isPending}
          className="w-full py-3 border border-[#5a61472e] text-[#7c8268] font-['Cormorant_SC'] text-[10px] uppercase tracking-[0.25em] transition-all hover:text-[#3f4632]"
        >
          Não, manter reserva
        </button>
      </div>
    </div>
  );
}
