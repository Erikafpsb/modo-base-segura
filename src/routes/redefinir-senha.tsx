import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { updatePassword } from "@/lib/mock-auth";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/redefinir-senha")({
  head: () => ({
    meta: [
      { title: "Nova senha — Modo" },
      { name: "description", content: "Defina uma nova senha para sua conta do Modo." },
      { property: "og:title", content: "Nova senha — Modo" },
      { property: "og:description", content: "Defina uma nova senha no Modo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Redefinir,
});

function Redefinir() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    setLoading(true);
    await updatePassword(senha);
    setLoading(false);
    navigate({ to: "/entrar", replace: true });
  }

  return (
    <AuthShell title="Criar nova senha" subtitle="Escolha uma senha nova para sua conta.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="senha">Nova senha</Label>
          <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Salvando..." : "Salvar nova senha"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-muted-foreground">
        Lembrou a senha?{" "}
        <Link to="/entrar" className="text-primary underline-offset-4 hover:underline">Voltar para o login</Link>
      </p>
    </AuthShell>
  );
}
