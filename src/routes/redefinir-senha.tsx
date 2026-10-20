import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { traduzir } from "./cadastro";

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
  const [pronto, setPronto] = useState(false);
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setPronto(true);
    });
    supabase.auth.getSession().then(({ data: s }) => s.session && setPronto(true));
    return () => data.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) return setErro(traduzir(error.message));
    navigate({ to: "/painel", replace: true });
  }

  return (
    <AuthShell title="Criar nova senha" subtitle="Escolha uma senha nova para sua conta.">
      {pronto ? (
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
      ) : (
        <p className="text-sm text-muted-foreground">
          Abra esta página pelo link enviado ao seu e-mail.{" "}
          <Link to="/recuperar-senha" className="text-primary underline-offset-4 hover:underline">Pedir novo link</Link>
        </p>
      )}
    </AuthShell>
  );
}
