"use client";

import { useEffect, useState } from "react";
import { verifyTokenAction, cancelReservationAction } from "@/app/actions/reservations";
import { Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface ReservationEntry {
  productId: string;
  token: string;
}

interface ValidReservation {
  productId: string;
  productName: string;
  token: string;
}

export function MyReservations() {
  const [reservations, setReservations] = useState<ValidReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  useEffect(() => {
    async function loadReservations() {
      const stored = localStorage.getItem("tbl:reservations");
      if (!stored) {
        setLoading(false);
        return;
      }

      const entries: ReservationEntry[] = JSON.parse(stored);
      const valid: ValidReservation[] = [];
      const stillStored: ReservationEntry[] = [];

      for (const entry of entries) {
        const data = await verifyTokenAction(entry.token);
        if (data) {
          valid.push({
            productId: data.productId,
            productName: data.productName,
            token: entry.token,
          });
          stillStored.push(entry);
        }
      }

      // Prune invalid ones from localStorage
      localStorage.setItem("tbl:reservations", JSON.stringify(stillStored));
      setReservations(valid);
      setLoading(false);
    }

    loadReservations();
  }, []);

  async function handleCancel(token: string) {
    const result = await cancelReservationAction(token);
    if (result.success) {
      const updated = reservations.filter((r) => r.token !== token);
      setReservations(updated);
      
      const stored = localStorage.getItem("tbl:reservations");
      if (stored) {
        const entries: ReservationEntry[] = JSON.parse(stored);
        const filtered = entries.filter((e) => e.token !== token);
        localStorage.setItem("tbl:reservations", JSON.stringify(filtered));
      }
      
      toast.success("Reserva cancelada com sucesso.");
      setConfirmCancel(null);
    } else {
      toast.error("Erro ao cancelar reserva.");
    }
  }

  if (loading) return null;
  if (reservations.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16 animate-in fade-in duration-700">
      <div className="bg-[#f4f2e6] border border-[#5a61471c] p-8">
        <div className="flex items-center gap-4 mb-6">
          <h3 className="font-['Cormorant_SC'] text-xs tracking-[0.25em] text-[#3f4632] uppercase font-bold">
            Minhas Reservas
          </h3>
          <div className="flex-1 h-px bg-[#5a61471c]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((res) => (
            <div key={res.token} className="bg-[#faf9f1] border border-[#5a61472e] p-5 flex justify-between items-center group">
              <div className="space-y-1">
                <p className="font-['Cormorant_Garamond'] text-lg text-[#3f4632] font-medium leading-tight">
                  {res.productName}
                </p>
                <p className="font-['Cormorant_SC'] text-[10px] tracking-widest text-[#7c8268] uppercase">
                  Reservado por você
                </p>
              </div>

              {confirmCancel === res.token ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCancel(res.token)}
                    className="p-2 text-red-600 hover:bg-red-50 transition-colors rounded-full"
                    title="Confirmar cancelamento"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmCancel(null)}
                    className="p-2 text-[#7c8268] hover:bg-gray-50 transition-colors rounded-full"
                    title="Voltar"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmCancel(res.token)}
                  className="p-2 text-[#7c8268] hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Cancelar reserva"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        <p className="mt-6 font-['Cormorant_Garamond'] italic text-[13px] text-[#7c8268] text-center">
          Obrigada por presentear os noivos! Se precisar cancelar algum item, use o botão acima.
        </p>
      </div>
    </section>
  );
}
