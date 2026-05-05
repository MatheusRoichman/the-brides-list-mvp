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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
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
      <div className="flex items-center justify-between">
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

      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-admin-line">
              <TableHead className="admin-table-head">Nome Completo</TableHead>
              <TableHead className="admin-table-head">Nome Curto</TableHead>
              <TableHead className="admin-table-head">Criado em</TableHead>
              <TableHead className="admin-table-head text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialCategories.length === 0 ? (
              <TableRow className="border-admin-line">
                <TableCell colSpan={4} className="text-center py-12 italic font-heading text-admin-ink-soft">
                  Nenhuma categoria cadastrada
                </TableCell>
              </TableRow>
            ) : (
              initialCategories.map((c) => (
                <TableRow key={c.id} className="border-admin-line">
                  <TableCell className="font-medium font-heading text-admin-ink-deep">{c.fullName}</TableCell>
                  <TableCell className="text-admin-ink">{c.shortName}</TableCell>
                  <TableCell className="text-sm text-admin-ink-soft">
                    {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Dialog open={editCategory?.id === c.id} onOpenChange={(open) => setEditCategory(open ? c : null)}>
                        <DialogTrigger render={
                          <Button variant="ghost" size="icon" className="cursor-pointer text-admin-ink-soft"><Pencil className="w-4 h-4" /></Button>
                        } />
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
                        <Button type="submit" variant="ghost" size="icon" className="cursor-pointer text-admin-error"><Trash2 className="w-4 h-4" /></Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
