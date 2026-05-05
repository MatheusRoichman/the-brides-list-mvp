import Image from "next/image";
import { listReservations } from "@/services/reservations";
import { Package, CalendarHeart, MessageSquare, Phone } from "lucide-react";

export default async function ReservationsPage() {
  const reservations = await listReservations();

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="admin-heading flex items-center gap-2">
          <CalendarHeart className="w-5 h-5 text-admin-ink-soft" />
          Reservas
        </h1>
        <p className="admin-subheading mt-1">
          {reservations.length} reserva{reservations.length !== 1 ? "s" : ""} realizada{reservations.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {reservations.length === 0 ? (
          <div className="col-span-full admin-card text-center py-12 italic font-heading text-admin-ink-soft">
            Nenhuma reserva encontrada
          </div>
        ) : (
          reservations.map((res) => (
            <div key={res.id} className="admin-card p-0 overflow-hidden flex flex-col group hover:border-admin-olive/30 transition-all duration-300 hover:shadow-md">
              {/* Product Image Section */}
              <div className="aspect-[4/3] bg-admin-paper relative border-b border-admin-line overflow-hidden group-hover:opacity-95 transition-opacity">
                {res.product.imageUrl ? (
                  <Image 
                    src={res.product.imageUrl} 
                    alt={res.product.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-admin-paper-warm">
                    <Package className="w-12 h-12 text-admin-line" />
                  </div>
                )}
                
                {/* Date Badge overlay */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <div className="bg-admin-paper/90 backdrop-blur-sm text-admin-ink border border-admin-line shadow-sm text-[10px] font-medium px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {new Date(res.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="flex-1">
                  <h3 className="font-heading font-semibold text-lg text-admin-ink-deep leading-tight mb-3 line-clamp-2" title={res.product.name}>
                    {res.product.name}
                  </h3>
                  
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-admin-ink-soft text-[10px] font-medium uppercase tracking-[0.1em]">Convidado</span>
                      <span className="text-admin-ink-deep font-semibold">{res.reserverName}</span>
                    </div>

                    {res.whatsapp && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-admin-ink-soft text-[10px] font-medium uppercase tracking-[0.1em]">WhatsApp</span>
                        <a 
                          href={`https://wa.me/${res.whatsapp.replace(/\D/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-admin-olive hover:text-admin-sage font-semibold flex items-center gap-1 transition-colors text-xs"
                        >
                          <Phone className="w-3 h-3" />
                          {res.whatsapp}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {res.message && (
                  <div className="mt-auto pt-3 border-t border-admin-line/50">
                    <div className="flex gap-2 text-admin-ink">
                      <MessageSquare className="w-3.5 h-3.5 text-admin-ink-soft shrink-0 mt-0.5" />
                      <p className="text-[11px] italic leading-relaxed text-admin-ink-soft line-clamp-4">
                        "{res.message}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
