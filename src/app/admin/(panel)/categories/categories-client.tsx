"use client";

import { useActionState, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { categories } from "@/db/schema";

import { createCategoryAction, editCategoryAction, deleteCategoryAction } from "@/app/admin/actions/categories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const categorySchema = z.object({
  fullName: z.string().min(1, "O nome completo é obrigatório"),
  shortName: z.string().min(1, "O nome curto é obrigatório"),
});

type _Category = InferSelectModel<typeof categories>;

/** Serialized version with ISO string dates for Server → Client transfer */
type Category = Omit<_Category, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };

export function CategoriesClient({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="admin-heading flex items-center gap-2">
            <Tag className="w-5 h-5 text-admin-ink-soft" />
            Categorias
          </h1>
          <p className="admin-subheading mt-1">
            {initialCategories.length} categoria{initialCategories.length !== 1 ? "s" : ""} cadastrada{initialCategories.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={
            <Button className="admin-btn-action"><Plus className="w-4 h-4 mr-2" />Nova Categoria</Button>
          } />
          <DialogContent className="max-w-md admin-dialog">
            <DialogHeader>
              <DialogTitle className="font-heading text-admin-ink-deep">Nova Categoria</DialogTitle>
              <DialogDescription className="text-admin-ink-soft">Preencha os dados da categoria</DialogDescription>
            </DialogHeader>
            <CategoryForm action={createCategoryAction} onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialCategories.length === 0 ? (
          <div className="col-span-full admin-card text-center py-12 italic font-heading text-admin-ink-soft">
            Nenhuma categoria cadastrada
          </div>
        ) : (
          initialCategories.map((c) => (
            <div key={c.id} className="admin-card p-5 flex flex-col gap-4 hover:border-admin-olive/30 transition-colors">
              <div className="flex-1">
                <h3 className="font-heading text-xl font-semibold text-admin-ink-deep mb-2">{c.fullName}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-admin-ink bg-admin-paper border-admin-line font-medium text-xs px-2 py-0.5">
                    {c.shortName}
                  </Badge>
                  <span className="text-admin-ink-soft text-xs font-medium">
                    • {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-admin-line/50">
                <Dialog open={editCategory?.id === c.id} onOpenChange={(open) => setEditCategory(open ? c : null)}>
                  <DialogTrigger>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-admin-ink-soft hover:text-admin-ink-deep border-admin-line bg-admin-paper hover:bg-admin-paper-warm">
                      <Pencil className="w-3.5 h-3.5 mr-1.5" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md admin-dialog">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-admin-ink-deep">Editar Categoria</DialogTitle>
                      <DialogDescription className="text-admin-ink-soft">Altere os dados da categoria</DialogDescription>
                    </DialogHeader>
                    <CategoryForm action={editCategoryAction} defaultValues={c} onSuccess={() => setEditCategory(null)} />
                  </DialogContent>
                </Dialog>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-admin-error hover:bg-admin-error/10 hover:text-admin-error">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CategoryForm({ action, defaultValues, onSuccess }: {
  action: typeof createCategoryAction | typeof editCategoryAction;
  defaultValues?: Category;
  onSuccess: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      fullName: defaultValues?.fullName ?? "",
      shortName: defaultValues?.shortName ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    const fd = new FormData();
    if (defaultValues) fd.set("id", defaultValues.id);
    fd.set("fullName", values.fullName);
    fd.set("shortName", values.shortName);
    
    import("react").then(({ startTransition }) => {
      startTransition(async () => {
        await formAction(fd);
        if (!state?.error) onSuccess();
      });
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          control={form.control}
          name="fullName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="admin-label">Nome Completo</FieldLabel>
              <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="shortName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="admin-label">Nome Curto</FieldLabel>
              <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {state?.error && <p className="admin-error">{state.error}</p>}

        <Button type="submit" disabled={pending} className="admin-btn-primary">
          {pending ? "Salvando..." : defaultValues ? "Atualizar" : "Criar Categoria"}
        </Button>
      </FieldGroup>
    </form>
  );
}
