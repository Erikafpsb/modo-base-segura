import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signInWithPassword } from "@/lib/supabase-auth";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar — Modo" },
      { name: "description", content: "Acesse sua conta do Modo." },
      { property: "og:title", content: "Entrar — Modo" },
      { property: "og:description", content: "Acesse sua conta do Modo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Entrar,
});

function Entrar() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const { error } = await signInWithPassword(email, senha);
    setLoading(false);
    if (error) return setErro(error);
    navigate({ to: "/painel", replace: true });
  }

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre com seu e-mail e senha."
      footer={<>Ainda não tem conta? <Link to="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">Criar conta</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="senha">Senha</Label>
            <Link to="/recuperar-senha" className="text-xs text-primary underline-offset-4 hover:underline">
              Esqueci minha senha
            </Link>
          </div>
          <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}
