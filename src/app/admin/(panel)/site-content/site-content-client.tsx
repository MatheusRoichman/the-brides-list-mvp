"use client";

import { useActionState, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { siteContent } from "@/db/schema";

import { saveSiteContentAction } from "@/app/admin/actions/site-content";
import { ImageUpload } from "@/components/image-upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FileText, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError, FieldGroup, FieldContent } from "@/components/ui/field";

const siteContentSchema = z.object({
  coupleName: z.string().min(1, "O nome do casal é obrigatório"),
  heroDescription: z.string().min(1, "A descrição é obrigatória"),
  eventTimestamp: z.string().min(1, "A data e hora são obrigatórias"),
  eventAddressPrimaryLine: z.string().min(1, "A linha principal do endereço é obrigatória"),
  eventAddressSecondaryLine: z.string().min(1, "A linha secundária do endereço é obrigatória"),
  suggestionsTitle: z.string().min(1, "O título é obrigatório"),
  suggestionsText: z.string().min(1, "O texto é obrigatório"),
  showPrices: z.boolean(),
  footerTitle: z.string().min(1, "O título do rodapé é obrigatório"),
  footerText: z.string().min(1, "O texto do rodapé é obrigatório"),
});

type SiteContentRow = InferSelectModel<typeof siteContent>;

/** Serialized version of SiteContentRow with ISO string dates (for Server → Client transfer) */
type SerializedSiteContent = Omit<SiteContentRow, "eventTimestamp" | "createdAt" | "updatedAt"> & {
  eventTimestamp: string;
  createdAt: string;
  updatedAt: string | null;
};

export function SiteContentClient({
  siteContent: existing,
}: {
  siteContent: SerializedSiteContent | null;
}) {
  const isNew = !existing;
  const [logoUrl, setLogoUrl] = useState(existing?.eventLogoUrl || "");
  const [state, formAction, pending] = useActionState(saveSiteContentAction, null);

  function formatDateForInput(isoString: string | null | undefined): string {
    if (!isoString) return "";
    return isoString.slice(0, 16);
  }

  const form = useForm<z.infer<typeof siteContentSchema>>({
    resolver: zodResolver(siteContentSchema),
    defaultValues: {
      coupleName: existing?.coupleName ?? "",
      heroDescription: existing?.heroDescription ?? "",
      eventTimestamp: formatDateForInput(existing?.eventTimestamp) ?? "",
      eventAddressPrimaryLine: existing?.eventAddressPrimaryLine ?? "",
      eventAddressSecondaryLine: existing?.eventAddressSecondaryLine ?? "",
      suggestionsTitle: existing?.suggestionsTitle ?? "",
      suggestionsText: existing?.suggestionsText ?? "",
      showPrices: existing?.showPrices ?? false,
      footerTitle: existing?.footerTitle ?? "",
      footerText: existing?.footerText ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof siteContentSchema>) => {
    import("react").then(({ startTransition }) => {
      startTransition(() => {
        const fd = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === "showPrices") {
            if (value) fd.set(key, "on");
          } else {
            fd.set(key, value as string);
          }
        });
        fd.set("eventLogoUrl", logoUrl);
        fd.set("_action", isNew ? "create" : "edit");
        formAction(fd);
      });
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="admin-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-admin-ink-soft" />
            Conteúdo do Site
          </h1>
          <p className="admin-subheading mt-1">
            {isNew ? "Configure o conteúdo inicial" : "Edite o conteúdo existente"}
          </p>
        </div>
        <span className={`admin-tag border ${isNew ? "text-admin-error bg-admin-accent/15 border-admin-accent/30" : "border-admin-line"}`}>
          {isNew ? "Não configurado" : "Configurado"}
        </span>
      </div>

      {state?.success && (
        <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-lg text-admin-ink bg-admin-ink/8 border border-admin-line">
          <CheckCircle2 className="w-4 h-4" />
          Conteúdo salvo com sucesso!
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          {/* Section: Couple & Event */}
          <SectionCard title="Informações do Casal" description="Dados principais do evento">
            <Controller
              control={form.control}
              name="coupleName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Nome do Casal</FieldLabel>
                  <Input id={field.name} placeholder="Ex: Glauci & Ezequiel" className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <div className="space-y-2">
              <Label className="admin-label">Logo do Evento</Label>
              <ImageUpload folder="site" value={logoUrl} onChange={setLogoUrl} id="eventLogoUrl" />
            </div>
          </SectionCard>

          {/* Section: Hero */}
          <SectionCard title="Seção Principal" description="Hero do site">
            <Controller
              control={form.control}
              name="heroDescription"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Descrição</FieldLabel>
                  <Textarea id={field.name} rows={3} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </SectionCard>

          {/* Section: Event Details */}
          <SectionCard title="Detalhes do Evento" description="Data, hora e local">
            <Controller
              control={form.control}
              name="eventTimestamp"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Data e Hora</FieldLabel>
                  <Input id={field.name} type="datetime-local" className="admin-input-plain" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="eventAddressPrimaryLine"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Endereço (linha principal)</FieldLabel>
                  <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="eventAddressSecondaryLine"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Endereço (linha secundária)</FieldLabel>
                  <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </SectionCard>

          {/* Section: Suggestions */}
          <SectionCard title="Seção de Sugestões" description="Lista de presentes">
            <Controller
              control={form.control}
              name="suggestionsTitle"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Título</FieldLabel>
                  <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="suggestionsText"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Texto</FieldLabel>
                  <Textarea id={field.name} rows={3} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="showPrices"
              render={({ field, fieldState }) => (
                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={field.value}
                    onChange={field.onChange}
                    className="w-4 h-4 rounded accent-admin-ink"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor={field.name} className="text-sm cursor-pointer font-heading text-admin-ink">
                    Exibir preços dos produtos
                  </FieldLabel>
                </Field>
              )}
            />
          </SectionCard>

          {/* Section: Footer */}
          <SectionCard title="Rodapé" description="Texto final do site">
            <Controller
              control={form.control}
              name="footerTitle"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Título do Rodapé</FieldLabel>
                  <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="footerText"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel htmlFor={field.name} className="admin-label">Texto do Rodapé</FieldLabel>
                  <Textarea id={field.name} rows={2} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
                  {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </SectionCard>

          <Separator className="admin-separator" />

          {state?.error && <p className="admin-error">{state.error}</p>}

          <Button type="submit" disabled={pending} className="admin-btn-primary h-12">
            {pending ? "Salvando..." : isNew ? "Criar Conteúdo" : "Salvar Alterações"}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}

/* ─── Reusable sub-components ─── */

function SectionCard({ title, description, children }: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-normal font-heading text-admin-ink-deep tracking-[0.04em]">
          {title}
        </h2>
        {description && (
          <p className="admin-subheading mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function FieldLabelOld({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <Label htmlFor={htmlFor} className="admin-label">
      {children}
    </Label>
  );
}
