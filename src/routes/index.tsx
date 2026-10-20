import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/AuthShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Modo — organize seu dia com calma" },
      { name: "description", content: "Modo é o seu espaço pessoal para organizar a rotina com leveza." },
      { property: "og:title", content: "Modo — organize seu dia com calma" },
      { property: "og:description", content: "Seu espaço pessoal para organizar a rotina com leveza." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="bg-hero flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <Button asChild variant="ghost">
          <Link to="/entrar">Entrar</Link>
        </Button>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Seu ritmo, seu modo</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight text-foreground md:text-7xl">
          Organize o seu dia com calma e clareza.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          O Modo é o seu espaço pessoal para planejar a rotina sem pressa. Crie sua conta e comece agora.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/cadastro">Criar conta grátis</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/entrar">Já tenho conta</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
