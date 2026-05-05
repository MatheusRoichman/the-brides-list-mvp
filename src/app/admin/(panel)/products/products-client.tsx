"use client";

import { useActionState, useState } from "react";
import type { InferSelectModel } from "drizzle-orm";
import type { products, categories } from "@/db/schema";

import { createProductAction, editProductAction, deleteProductAction } from "@/app/admin/actions/products";
import { ImageUpload } from "@/components/image-upload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const productSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  marketplace: z.string().min(1, "O link do marketplace é obrigatório"),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

type _Product = InferSelectModel<typeof products>;
type _Category = InferSelectModel<typeof categories>;

/** Serialized versions with ISO string dates for Server → Client transfer */
type Product = Omit<_Product, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };
type Category = Omit<_Category, "createdAt" | "updatedAt"> & { createdAt: string; updatedAt: string };

export function ProductsClient({
  products: initialProducts,
  categories: cats,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="admin-heading flex items-center gap-2">
            <Package className="w-5 h-5 text-admin-ink-soft" />
            Produtos
          </h1>
          <p className="admin-subheading mt-1">
            {initialProducts.length} produto{initialProducts.length !== 1 ? "s" : ""} cadastrado{initialProducts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={
            <Button className="admin-btn-action"><Plus className="w-4 h-4 mr-2" />Novo Produto</Button>
          } />
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto admin-dialog">
            <DialogHeader>
              <DialogTitle className="font-heading text-admin-ink-deep">Novo Produto</DialogTitle>
              <DialogDescription className="text-admin-ink-soft">Preencha os dados do produto</DialogDescription>
            </DialogHeader>
            <ProductForm categories={cats} action={createProductAction} onSuccess={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-admin-line">
              <TableHead className="admin-table-head">Imagem</TableHead>
              <TableHead className="admin-table-head">Nome</TableHead>
              <TableHead className="admin-table-head">Categoria</TableHead>
              <TableHead className="admin-table-head">Marketplace</TableHead>
              <TableHead className="admin-table-head">Preço</TableHead>
              <TableHead className="admin-table-head text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProducts.length === 0 ? (
              <TableRow className="border-admin-line">
                <TableCell colSpan={6} className="text-center py-12 italic font-heading text-admin-ink-soft">
                  Nenhum produto cadastrado
                </TableCell>
              </TableRow>
            ) : (
              initialProducts.map((p) => {
                const cat = cats.find((c) => c.id === p.category);
                return (
                  <TableRow key={p.id} className="border-admin-line">
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-admin-paper border border-admin-line">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-admin-ink-soft" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate font-heading text-admin-ink-deep">{p.name}</TableCell>
                    <TableCell><span className="admin-tag">{cat?.shortName || "—"}</span></TableCell>
                    <TableCell className="max-w-[150px] truncate text-sm text-admin-ink">{p.marketplace}</TableCell>
                    <TableCell className="text-sm text-admin-ink">
                      {p.minPrice && p.maxPrice && p.minPrice !== p.maxPrice
                        ? `R$ ${p.minPrice} – R$ ${p.maxPrice}`
                        : p.minPrice ? `R$ ${p.minPrice}` : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Dialog open={editProduct?.id === p.id} onOpenChange={(open) => setEditProduct(open ? p : null)}>
                          <DialogTrigger render={
                            <Button variant="ghost" size="icon" className="cursor-pointer text-admin-ink-soft"><Pencil className="w-4 h-4" /></Button>
                          } />
                          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto admin-dialog">
                            <DialogHeader>
                              <DialogTitle className="font-heading text-admin-ink-deep">Editar Produto</DialogTitle>
                              <DialogDescription className="text-admin-ink-soft">Altere os dados do produto</DialogDescription>
                            </DialogHeader>
                            <ProductForm categories={cats} action={editProductAction} defaultValues={p} onSuccess={() => setEditProduct(null)} />
                          </DialogContent>
                        </Dialog>
                        <form action={deleteProductAction}>
                          <input type="hidden" name="id" value={p.id} />
                          <Button type="submit" variant="ghost" size="icon" className="cursor-pointer text-admin-error"><Trash2 className="w-4 h-4" /></Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ProductForm({ categories, action, defaultValues, onSuccess }: {
  categories: Category[];
  action: typeof createProductAction | typeof editProductAction;
  defaultValues?: Product;
  onSuccess: () => void;
}) {
  const [imageUrl, setImageUrl] = useState(defaultValues?.imageUrl || "");
  const [categoryId, setCategoryId] = useState(defaultValues?.category || "");
  const [state, formAction, pending] = useActionState(action, null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      marketplace: defaultValues?.marketplace ?? "",
      minPrice: defaultValues?.minPrice ?? "",
      maxPrice: defaultValues?.maxPrice ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    const fd = new FormData();
    if (defaultValues) fd.set("id", defaultValues.id);
    fd.set("imageUrl", imageUrl);
    fd.set("categoryId", categoryId);
    fd.set("name", values.name);
    fd.set("marketplace", values.marketplace);
    if (values.minPrice) fd.set("minPrice", values.minPrice);
    if (values.maxPrice) fd.set("maxPrice", values.maxPrice);

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
        {defaultValues && <input type="hidden" name="id" value={defaultValues.id} />}

        <div className="space-y-2">
          <Label className="admin-label">Imagem</Label>
          <ImageUpload folder="products" value={imageUrl} onChange={setImageUrl} id="imageUrl" />
        </div>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="admin-label">Nome</FieldLabel>
              <Input id={field.name} className="admin-input" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="space-y-2">
          <Label className="admin-label">Categoria</Label>
          <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
            <SelectTrigger className="admin-input w-full"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
            <SelectContent className="bg-admin-paper-warm border-admin-line">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="font-heading text-admin-ink-deep">{c.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Controller
          control={form.control}
          name="marketplace"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="admin-label">Link do Marketplace</FieldLabel>
              <Input id={field.name} className="admin-input-plain" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-3">
          <Controller
            control={form.control}
            name="minPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <FieldLabel htmlFor={field.name} className="admin-label">Preço mín.</FieldLabel>
                <Input id={field.name} type="number" step="0.01" className="admin-input-plain" aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="maxPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <FieldLabel htmlFor={field.name} className="admin-label">Preço máx.</FieldLabel>
                <Input id={field.name} type="number" step="0.01" className="admin-input-plain" aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {state?.error && <p className="admin-error">{state.error}</p>}

        <Button type="submit" disabled={pending} className="admin-btn-primary">
          {pending ? "Salvando..." : defaultValues ? "Atualizar" : "Criar Produto"}
        </Button>
      </FieldGroup>
    </form>
  );
}
