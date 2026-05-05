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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Package, Filter } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";

const productSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  marketplace: z.string().min(1, "O marketplace é obrigatório"),
  marketplaceLink: z.string().min(1, "O link do marketplace é obrigatório"),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

const MARKETPLACES = [
  { value: "mercadolivre", label: "Mercado Livre" },
  { value: "amazon", label: "Amazon" },
  { value: "magalu", label: "Magalu" },
  { value: "shopee", label: "Shopee" },
  { value: "americanas", label: "Americanas" },
  { value: "casasbahia", label: "Casas Bahia" },
  { value: "aliexpress", label: "AliExpress" },
  { value: "outros", label: "Outros" }
];

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

  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [marketplaceFilter, setMarketplaceFilter] = useState("");

  const filteredProducts = initialProducts.filter(p => {
    if (nameFilter && !p.name.toLowerCase().includes(nameFilter.toLowerCase())) return false;
    if (categoryFilter && categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (marketplaceFilter && marketplaceFilter !== "all" && p.marketplace !== marketplaceFilter) return false;
    return true;
  });

  const getCategoryLabel = (id: string) => {
    if (!id || id === "all") return "Todas as categorias";
    return cats.find(c => c.id === id)?.fullName || id;
  };

  const getMarketplaceLabel = (id: string) => {
    if (!id || id === "all") return "Todos os marketplaces";
    return MARKETPLACES.find(m => m.value === id)?.label || id;
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 admin-card p-4">
        <div className="flex-1 flex gap-2">
          <Input 
            placeholder="Buscar por nome..." 
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="admin-input h-10 flex-1"
          />
          <Popover>
            <PopoverTrigger render={
              <Button variant="outline" className="admin-input h-10 px-4 font-heading text-admin-ink-deep bg-admin-paper-warm hover:bg-admin-paper-warm/80">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {(categoryFilter || marketplaceFilter) && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-admin-ink-deep text-admin-paper">
                    {(categoryFilter && categoryFilter !== "all" ? 1 : 0) + (marketplaceFilter && marketplaceFilter !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            } />
            <PopoverContent className="w-80 bg-admin-paper-warm border-admin-line p-4 space-y-4" align="end">
              <div className="space-y-1">
                <h4 className="font-heading text-sm text-admin-ink-deep font-semibold">Filtros</h4>
                <p className="text-xs text-admin-ink-soft">Refine a lista de produtos</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs admin-label">Categoria</Label>
                <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v ?? "")}>
                  <SelectTrigger className="admin-input w-full">
                    <SelectValue placeholder="Categoria">
                      {categoryFilter ? getCategoryLabel(categoryFilter) : "Categoria"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-admin-paper-warm border-admin-line">
                    <SelectItem value="all" className="font-heading text-admin-ink-deep">Todas as categorias</SelectItem>
                    {cats.map(c => (
                      <SelectItem key={c.id} value={c.id} className="font-heading text-admin-ink-deep">{c.fullName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs admin-label">Marketplace</Label>
                <Select value={marketplaceFilter} onValueChange={(v) => setMarketplaceFilter(v ?? "")}>
                  <SelectTrigger className="admin-input w-full">
                    <SelectValue placeholder="Marketplace">
                      {marketplaceFilter ? getMarketplaceLabel(marketplaceFilter) : "Marketplace"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-admin-paper-warm border-admin-line">
                    <SelectItem value="all" className="font-heading text-admin-ink-deep">Todos os marketplaces</SelectItem>
                    {MARKETPLACES.map(m => (
                      <SelectItem key={m.value} value={m.value} className="font-heading text-admin-ink-deep">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(categoryFilter || marketplaceFilter) && (
                <Button 
                  variant="ghost" 
                  onClick={() => { setCategoryFilter(""); setMarketplaceFilter(""); }}
                  className="w-full text-xs text-admin-ink-soft mt-2 hover:bg-admin-line/50 cursor-pointer"
                >
                  Limpar Filtros
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full admin-card text-center py-12 italic font-heading text-admin-ink-soft">
            Nenhum produto encontrado
          </div>
        ) : (
          filteredProducts.map((p) => {
            const cat = cats.find((c) => c.id === p.category);
            return (
              <div key={p.id} className="admin-card p-0 overflow-hidden flex flex-col group hover:border-admin-olive/30 transition-all duration-300 hover:shadow-md">
                {/* Image Section */}
                <div className="aspect-[4/3] bg-admin-paper relative border-b border-admin-line overflow-hidden group-hover:opacity-95 transition-opacity">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-admin-paper-warm">
                      <Package className="w-12 h-12 text-admin-line" />
                    </div>
                  )}
                  {/* Category Badge overlay */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <Badge className="bg-admin-paper/90 backdrop-blur-sm text-admin-ink border-admin-line shadow-sm hover:bg-admin-paper text-xs font-medium px-2 py-0.5">
                      {cat?.shortName || "Sem categoria"}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg text-admin-ink-deep leading-tight mb-2 line-clamp-2" title={p.name}>
                      {p.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-admin-ink-soft text-xs font-medium bg-admin-paper-warm px-2 py-1 rounded-md">
                        {MARKETPLACES.find(m => m.value === p.marketplace)?.label || p.marketplace}
                      </span>
                      {/* @ts-ignore */}
                      {p.marketplaceLink && (
                        // @ts-ignore
                        <a href={p.marketplaceLink} target="_blank" rel="noreferrer" className="text-admin-olive hover:text-admin-sage flex items-center gap-1 text-xs font-semibold transition-colors">
                          Ver loja ↗
                        </a>
                      )}
                    </div>
                    
                    <div className="text-admin-ink font-semibold text-[15px]">
                      {p.minPrice && p.maxPrice && p.minPrice !== p.maxPrice
                        ? `R$ ${p.minPrice} – R$ ${p.maxPrice}`
                        : p.minPrice ? `R$ ${p.minPrice}` : "Sem preço"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-admin-line/50 mt-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <Dialog open={editProduct?.id === p.id} onOpenChange={(open) => setEditProduct(open ? p : null)}>
                      <DialogTrigger>
                         <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-admin-ink-soft hover:text-admin-ink-deep flex-1 bg-admin-paper border-admin-line hover:bg-admin-paper-warm">
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Editar
                        </Button>
                      </DialogTrigger>
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
                      <Button type="submit" variant="ghost" size="sm" className="h-8 w-8 p-0 text-admin-error hover:bg-admin-error/10 hover:text-admin-error">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
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
      // @ts-ignore
      marketplaceLink: defaultValues?.marketplaceLink ?? "",
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
    fd.set("marketplaceLink", values.marketplaceLink);
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
            <SelectTrigger className="admin-input w-full">
              <SelectValue placeholder="Selecione uma categoria">
                {categoryId ? categories.find(c => c.id === categoryId)?.fullName || categoryId : "Selecione uma categoria"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-admin-paper-warm border-admin-line">
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="font-heading text-admin-ink-deep">{c.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="admin-label">Marketplace</Label>
          <Controller
            control={form.control}
            name="marketplace"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="space-y-2">
                <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "")}>
                  <SelectTrigger className="admin-input w-full" aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Selecione o marketplace">
                      {field.value ? MARKETPLACES.find(m => m.value === field.value)?.label || field.value : "Selecione o marketplace"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-admin-paper-warm border-admin-line">
                    {MARKETPLACES.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="font-heading text-admin-ink-deep">{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="marketplaceLink"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="space-y-2">
              <FieldLabel htmlFor={field.name} className="admin-label">Link do Marketplace</FieldLabel>
              <Input id={field.name} className="admin-input-plain" aria-invalid={fieldState.invalid} {...field} />
              {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
