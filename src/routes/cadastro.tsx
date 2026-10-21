import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { signUp } from "@/lib/mock-auth";
import { AuthShell } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/cadastro")({
  head: () => ({
    meta: [
      { title: "Criar conta — Modo" },
      { name: "description", content: "Crie sua conta no Modo com nome, e-mail e senha." },
      { property: "og:title", content: "Criar conta — Modo" },
      { property: "og:description", content: "Crie sua conta no Modo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cadastro,
});

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) return setErro("A senha precisa ter pelo menos 6 caracteres.");
    setLoading(true);
    await signUp(nome.trim(), email, senha);
    setLoading(false);
    setEnviado(true);
  }

  if (enviado) {
    return (
      <AuthShell title="Confira seu e-mail" subtitle={`Enviamos um link de confirmação para ${email}.`}>
        <p className="text-sm text-muted-foreground">Depois de confirmar, é só entrar com seu e-mail e senha.</p>
        <Button asChild className="mt-6 w-full">
          <Link to="/entrar">Ir para o login</Link>
        </Button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Leva menos de um minuto."
      footer={<>Já tem conta? <Link to="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">Entrar</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" required value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="senha">Senha</Label>
          <Input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="new-password" />
        </div>
        {erro && <p className="text-sm text-destructive">{erro}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}

/** @deprecated Mantido apenas para compatibilidade de importação em outros arquivos. Pode remover quando refatorar. */
export function traduzir(msg: string) {
  return msg;
}
