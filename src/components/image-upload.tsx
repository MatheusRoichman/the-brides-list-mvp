"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, ImageIcon, X } from "lucide-react";

interface ImageUploadProps {
  folder: string;
  value: string;
  onChange: (url: string) => void;
  id?: string;
}

export function ImageUpload({ folder, value, onChange, id }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("folder", folder);
      const res = await fetch("/admin/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden w-full aspect-video border border-admin-line bg-admin-paper">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-admin-paper-warm/90 text-admin-ink-deep"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer disabled:cursor-wait transition-colors border-admin-line bg-admin-paper/50 text-admin-ink-soft"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <ImageIcon className="w-6 h-6" />
          )}
          <span className="text-xs uppercase tracking-[0.18em] font-label">
            {uploading ? "Enviando..." : "Clique para enviar imagem"}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {/* Hidden input to carry the URL in the form */}
      <Input type="hidden" name={id} value={value} />

      {value && (
        <p className="text-xs truncate text-admin-ink-soft" title={value}>{value}</p>
      )}

      {error && <p className="text-xs text-admin-error">{error}</p>}
    </div>
  );
}
