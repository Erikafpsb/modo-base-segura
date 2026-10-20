import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, CheckSquare, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/AuthShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel — Modo" },
      { name: "description", content: "Seu painel pessoal no Modo." },
      { property: "og:title", content: "Painel — Modo" },
      { property: "og:description", content: "Seu painel pessoal no Modo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Painel,
});

const futuros = [
  { icon: CheckSquare, titulo: "Tarefas", texto: "Organize o que precisa ser feito." },
  { icon: CalendarDays, titulo: "Calendário", texto: "Veja sua semana de relance." },
  { icon: Sparkles, titulo: "Novidades", texto: "Mais recursos chegando em breve." },
];

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function Painel() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: perfil } = useQuery({
    queryKey: ["perfil", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("nome").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
  const nome = perfil?.nome?.split(" ")[0] || (user.user_metadata?.nome as string | undefined) || "";

  async function sair() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/entrar", replace: true });
  }

  return (
    <div className="bg-hero min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
          <Button variant="outline" onClick={sair}>Sair</Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-8">
        <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
          {saudacao()}{nome ? `, ${nome}` : ""}!
        </h1>
        <p className="mt-3 text-muted-foreground">Este é o seu espaço. Em breve, novas funcionalidades aparecerão aqui.</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {futuros.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="rounded-2xl border border-dashed bg-card/70 p-6">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-primary" />
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">Em breve</span>
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold text-foreground">{titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
