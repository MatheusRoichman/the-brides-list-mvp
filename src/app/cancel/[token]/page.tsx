import { verifyTokenAction } from "@/app/actions/reservations";
import { CancelConfirmation } from "./cancel-confirmation";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function CancelPage({ params }: PageProps) {
  const { token } = await params;
  
  if (!token) notFound();

  const reservation = await verifyTokenAction(token);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#faf9f1] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="font-['Pinyon_Script'] text-5xl text-[#3f4632]">Ops...</h1>
          <p className="font-['Cormorant_Garamond'] text-xl text-[#5a6147] italic">
            Esta reserva não foi encontrada ou já foi cancelada.
          </p>
          <a 
            href="/"
            className="inline-block py-3 px-8 bg-[#3f4632] text-[#f4f2e6] font-['Cormorant_SC'] text-xs uppercase tracking-[0.25em] transition-all hover:bg-[#5a6147]"
          >
            Voltar para a lista
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f1] flex items-center justify-center p-4">
      <CancelConfirmation 
        token={token} 
        productName={reservation.productName} 
      />
    </div>
  );
}
