import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { resetPasswordForEmail } from "@/lib/supabase-auth";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Modo" },
      { name: "description", content: "Receba um link para redefinir sua senha do Modo." },
      { property: "og:title", content: "Recuperar senha — Modo" },
      { property: "og:description", content: "Redefina sua senha do Modo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Recuperar,
});

function Recuperar() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await resetPasswordForEmail(email);
    setLoading(false);
    setEnviado(true);
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={<Link to="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">Voltar para o login</Link>}
    >
      {enviado ? (
        <p className="text-sm text-muted-foreground">
          Se houver uma conta com <strong>{email}</strong>, você receberá o link em instantes. Confira também o spam.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
