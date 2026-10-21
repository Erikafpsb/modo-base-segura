import { createFileRoute } from "@tanstack/react-router";
import { BarChart2, CheckCircle2, Clock, Flame, AlertTriangle, TrendingUp, Lock } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { TAREFAS, HABITOS, SESSOES_FOCO, MODOS, PLANO_USUARIO } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/estatisticas")({
  head: () => ({ meta: [{ title: "Estatísticas — Modo" }] }),
  component: Estatisticas,
});

function Estatisticas() {
  const { user } = Route.useRouteContext();
  const isPremium = PLANO_USUARIO === "premium";

  const concluidas = TAREFAS.filter((t) => t.status === "concluida").length;
  const pendentes = TAREFAS.filter((t) => t.status === "pendente" || t.status === "em_progresso").length;
  const atrasadas = TAREFAS.filter((t) => t.status === "atrasada").length;
  const totalTarefas = TAREFAS.length;
  const taxaConclusao = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

  const totalSessoes = SESSOES_FOCO.length;
  const totalMinFoco = SESSOES_FOCO.reduce((a, s) => a + s.duracaoMin, 0);

  const hoje = new Date().toISOString().split("T")[0];
  const habitosHoje = HABITOS.filter((h) => h.registros.includes(hoje)).length;

  // Tarefas por modo
  const tarefasPorModo = MODOS.map((m) => ({
    ...m,
    total: TAREFAS.filter((t) => t.modoId === m.id).length,
    concluidas: TAREFAS.filter((t) => t.modoId === m.id && t.status === "concluida").length,
  }));

  // Últimos 7 dias — sessões de foco
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split("T")[0];
    const min = SESSOES_FOCO.filter((s) => s.concluidaEm === iso).reduce((a, s) => a + s.duracaoMin, 0);
    return { iso, label: d.toLocaleDateString("pt-BR", { weekday: "short" }), min };
  });
  const maxMin = Math.max(...ultimos7.map((d) => d.min), 1);

  return (
    <AppLayout user={user}>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Estatísticas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe sua evolução ao longo do tempo.</p>
      </div>

      {/* Resumo */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard color="text-primary" icon={<CheckCircle2 size={20} />} label="Concluídas" value={concluidas} sub="tarefas" />
        <StatCard color="text-amber-500" icon={<AlertTriangle size={20} />} label="Atrasadas" value={atrasadas} sub="tarefas" />
        <StatCard color="text-cyan-500" icon={<Clock size={20} />} label="Foco total" value={`${totalMinFoco}min`} sub={`${totalSessoes} sessões`} />
        <StatCard color="text-emerald-500" icon={<Flame size={20} />} label="Hábitos hoje" value={habitosHoje} sub={`de ${HABITOS.length}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Taxa de conclusão */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Taxa de conclusão</h2>
          <div className="flex items-center gap-6">
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
              <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-secondary)" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-primary)" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - taxaConclusao / 100)}`}
                  className="transition-all duration-700" />
              </svg>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{taxaConclusao}%</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <LegendaItem color="bg-primary" label="Concluídas" value={concluidas} />
              <LegendaItem color="bg-amber-400" label="Pendentes" value={pendentes} />
              <LegendaItem color="bg-destructive" label="Atrasadas" value={atrasadas} />
            </div>
          </div>
        </div>

        {/* Foco por dia */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Minutos de foco (últimos 7 dias)</h2>
          <div className="flex h-32 items-end gap-2">
            {ultimos7.map((d) => (
              <div key={d.iso} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-primary/80 transition-all duration-700"
                  style={{ height: `${(d.min / maxMin) * 100}%`, minHeight: d.min > 0 ? "4px" : "0" }}
                />
                <span className="text-[10px] capitalize text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tarefas por modo */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Tarefas por modo</h2>
          <div className="space-y-3">
            {tarefasPorModo.map((m) => {
              const pct = m.total > 0 ? Math.round((m.concluidas / m.total) * 100) : 0;
              return (
                <div key={m.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{m.nome}</span>
                    <span className="text-xs text-muted-foreground">{m.concluidas}/{m.total} · {pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.cor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hábitos semana */}
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Hábitos esta semana</h2>
          <div className="space-y-3">
            {HABITOS.map((h) => {
              const ultimos7dias = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(); d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split("T")[0];
              });
              const feitos = ultimos7dias.filter((d) => h.registros.includes(d)).length;
              return (
                <div key={h.id} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: h.cor + "22" }}>
                    {h.nome[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{h.nome}</p>
                  </div>
                  <div className="flex gap-1">
                    {ultimos7dias.map((d, i) => (
                      <div key={i} className="h-4 w-4 rounded-sm" style={{ background: h.registros.includes(d) ? h.cor : "var(--color-secondary)" }} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: h.cor }}>{feitos}/7</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recursos Premium bloqueados */}
      {!isPremium && (
        <div className="mt-6 rounded-2xl border border-dashed bg-card/50 p-6">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">Histórico ampliado disponível no Premium</p>
              <p className="text-sm text-muted-foreground">Acesse filtros por período, relatórios exportáveis e comparações mensais.</p>
            </div>
            <TrendingUp size={20} className="ml-auto text-primary" />
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function LegendaItem({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="ml-auto text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
