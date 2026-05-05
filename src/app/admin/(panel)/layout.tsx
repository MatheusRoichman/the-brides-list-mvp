import type { Metadata } from "next";
import Link from "next/link";
import { logoutAction } from "../actions/auth";
import { env } from "@/env";
import {
  Package,
  Tag,
  FileText,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Admin · Lista de Presentes",
  description: "Painel de administração da lista de presentes",
};

const navItems = [
  { href: "/admin/products", label: "Produtos", icon: Package },
  { href: "/admin/categories", label: "Categorias", icon: Tag },
  { href: "/admin/site-content", label: "Conteúdo", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-admin-paper text-admin-ink">
      <aside className="admin-card hidden md:flex w-60 flex-col rounded-none border-r border-l-0 border-y-0">
        <div className="p-5">
          <Link href="/admin/products" className="flex items-center gap-3 group">
            <div className="admin-icon-circle w-9 h-9">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-admin-ink">
                <path d="M12 3C7.5 9 4 14 4 17a8 8 0 0016 0c0-3-3.5-8-8-14z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium font-heading text-admin-ink-deep tracking-[0.04em]">
                {env.ADMIN_NAME}
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] font-label text-admin-ink-soft">
                Painel Admin
              </p>
            </div>
          </Link>
        </div>

        <Separator className="admin-separator" />

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="admin-nav-link"
            >
              <item.icon className="w-4 h-4 text-admin-ink-soft" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3">
          <form action={logoutAction}>
            <button
              type="submit"
              className="admin-nav-link w-full text-admin-ink-soft cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-admin-paper/92 backdrop-blur-sm border-b border-admin-line">
          <Link href="/admin/products" className="flex items-center gap-2">
            <div className="admin-icon-circle w-8 h-8">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-admin-ink">
                <path d="M12 3C7.5 9 4 14 4 17a8 8 0 0016 0c0-3-3.5-8-8-14z" />
              </svg>
            </div>
            <span className="text-sm font-heading text-admin-ink-deep">
              {env.ADMIN_NAME}
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 rounded-lg transition-colors text-admin-ink"
                title={item.label}
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}
            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2 rounded-lg transition-colors cursor-pointer text-admin-ink-soft"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </nav>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
