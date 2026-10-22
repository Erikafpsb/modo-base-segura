import { createFileRoute } from "@tanstack/react-router";
import { CheckSquare, Clock, AlertTriangle, TrendingUp, Plus, Layers, CalendarDays } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useTarefas, useHabitos, useSessoesFoco, useModos } from "@/hooks/use-supabase-data";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel — Modo" },
      { name: "description", content: "Seu painel pessoal no Modo." },
    ],
  }),
  component: Painel,
});

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function formatarData() {
  return new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
}

function Painel() {
  const { user } = Route.useRouteContext();
  const nome = user.nome?.split(" ")[0] || "";

  const { data: tarefas = [] } = useTarefas();
  const { data: habitos = [] } = useHabitos();
  const { data: sessoes = [] } = useSessoesFoco();
  const { data: modos = [] } = useModos();

  const hoje = new Date().toISOString().split("T")[0];
  const tarefasHoje = tarefas.filter((t) => t.prazo === hoje && t.status !== "concluida");
  const atrasadas = tarefas.filter((t) => t.status === "atrasada");
  const concluidas = tarefas.filter((t) => t.status === "concluida");
  const totalPendentes = tarefas.filter((t) => t.status !== "concluida").length;
  const totalTarefas = tarefas.length;
  const progressoDiario = totalTarefas > 0 ? Math.round((concluidas.length / totalTarefas) * 100) : 0;

  const habitosHoje = habitos.filter((h) => (h.registros as string[]).includes(hoje)).length;
  const minutosFoco = sessoes
    .filter((s) => s.concluida_em === hoje)
    .reduce((a, s) => a + s.duracao_min, 0);

  return (
    <AppLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm capitalize text-muted-foreground">{formatarData()}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold text-foreground md:text-4xl">
          {saudacao()}{nome ? `, ${nome}` : ""}! 👋
        </h1>
      </div>

      {/* Cards de resumo */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<CheckSquare className="h-5 w-5 text-primary" />} label="Concluídas" value={concluidas.length} sub="tarefas" />
        <StatCard icon={<AlertTriangle className="h-5 w-5 text-amber-500" />} label="Pendentes" value={totalPendentes} sub="tarefas" />
        <StatCard icon={<Clock className="h-5 w-5 text-cyan-500" />} label="Foco hoje" value={`${minutosFoco}min`} sub="de sessões" />
        <StatCard icon={<TrendingUp className="h-5 w-5 text-emerald-500" />} label="Hábitos hoje" value={habitosHoje} sub={`de ${habitos.length}`} />
      </div>

      {/* Progresso diário */}
      <div className="mb-8 rounded-2xl border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Progresso do dia</span>
          <span className="text-sm font-bold text-primary">{progressoDiario}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${progressoDiario}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{concluidas.length} de {totalTarefas} tarefas concluídas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tarefas de hoje */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Para hoje</h2>
            <Button asChild size="sm" variant="ghost" className="h-8 gap-1 text-xs">
              <Link to="/tarefas"><Plus size={13} />Nova</Link>
            </Button>
          </div>
          {tarefasHoje.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje. 🎉</p>
          ) : (
            <ul className="space-y-2">
              {tarefasHoje.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2.5">
                  <PrioridadePonto prioridade={t.prioridade} />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{t.titulo}</span>
                  <ModoTag modoId={t.modo_id} modos={modos} />
                </li>
              ))}
              {tarefasHoje.length > 5 && (
                <li className="text-center text-xs text-muted-foreground">+ {tarefasHoje.length - 5} mais</li>
              )}
            </ul>
          )}
        </div>

        {/* Atrasadas */}
        <div className="rounded-2xl border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Atrasadas</h2>
            {atrasadas.length > 0 && (
              <span className="rounded-full bg-destructive/15 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                {atrasadas.length}
              </span>
            )}
          </div>
          {atrasadas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa atrasada. ✅</p>
          ) : (
            <ul className="space-y-2">
              {atrasadas.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl bg-destructive/8 px-3 py-2.5">
                  <AlertTriangle size={14} className="shrink-0 text-destructive" />
                  <span className="min-w-0 flex-1 truncate text-sm text-foreground">{t.titulo}</span>
                  {t.prazo && <span className="text-xs text-destructive">{new Date(t.prazo).toLocaleDateString("pt-BR")}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Atalhos */}
        <div className="rounded-2xl border bg-card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Atalhos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { to: "/modos", icon: <Layers size={20} className="text-primary" />, label: "Ver Modos" },
              { to: "/tarefas", icon: <CheckSquare size={20} className="text-emerald-500" />, label: "Minhas Tarefas" },
              { to: "/calendario", icon: <CalendarDays size={20} className="text-cyan-500" />, label: "Calendário" },
              { to: "/foco", icon: <Clock size={20} className="text-amber-500" />, label: "Iniciar Foco" },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-secondary/40 p-4 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {a.icon}
                <span className="text-xs font-medium text-foreground">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-2">{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label} <span className="text-foreground/50">{sub}</span></div>
    </div>
  );
}

function PrioridadePonto({ prioridade }: { prioridade: string }) {
  const cores: Record<string, string> = { alta: "bg-destructive", media: "bg-amber-400", baixa: "bg-emerald-400" };
  return <span className={`h-2 w-2 shrink-0 rounded-full ${cores[prioridade] || "bg-muted-foreground"}`} />;
}

function ModoTag({ modoId, modos }: { modoId: string | null; modos: { id: string; nome: string; cor: string }[] }) {
  if (!modoId) return null;
  const modo = modos.find((m) => m.id === modoId);
  if (!modo) return null;
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ background: modo.cor }}>
      {modo.nome}
    </span>
  );
}
