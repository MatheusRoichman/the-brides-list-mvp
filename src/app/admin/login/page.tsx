"use client";

import { useActionState, startTransition } from "react";
import { loginAction } from "../actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const loginSchema = z.object({
  password: z.string().min(1, "A senha é obrigatória"),
});

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    startTransition(() => {
      const formData = new FormData();
      formData.set("password", values.password);
      formAction(formData);
    });
  }

  return (
    <div className="admin-login-bg min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="admin-icon-circle mx-auto w-16 h-16 mb-5">
            <Lock className="w-7 h-7 text-admin-ink" />
          </div>
          <h1 className="text-3xl mt-2 font-normal mb-2 font-heading text-admin-ink-deep tracking-[0.04em]">
            The Bride's List
          </h1>
          <p className="text-sm uppercase tracking-[0.28em] font-label text-admin-ink-soft">
            Painel Administrativo
          </p>
        </div>

        <div className="admin-card p-6 shadow-sm">
          <form action={formAction} onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-5">
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="space-y-2">
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-xs uppercase tracking-[0.24em] font-label text-admin-ink-soft"
                  >
                    Senha de Acesso
                  </FieldLabel>
                  <Input
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    autoFocus
                    className="admin-input text-center h-12 text-base"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && <FieldError className="text-center text-xs" errors={[fieldState.error]} />}
                </Field>
              )}
            />
            {state?.error && (
              <p className="admin-error text-center">
                {state.error}
              </p>
            )}
            <Button
              type="submit"
              disabled={pending}
              className="admin-btn-primary transition-colors duration-200"
            >
              {pending ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-3 mt-8 text-admin-ink-soft">
          <span className="h-px flex-1 bg-admin-line" />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3C7.5 9 4 14 4 17a8 8 0 0016 0c0-3-3.5-8-8-14z" />
          </svg>
          <span className="h-px flex-1 bg-admin-line" />
        </div>
      </div>
    </div>
  );
}
