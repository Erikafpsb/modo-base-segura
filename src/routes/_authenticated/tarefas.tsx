import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, CheckCircle2, Circle, AlertTriangle, Filter, Trash2 } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { TAREFAS, MODOS, type Tarefa, type StatusTarefa, type Prioridade } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas — Modo" }] }),
  component: Tarefas,
});

const PRIORIDADE_LABEL: Record<Prioridade, string> = { alta: "Alta", media: "Média", baixa: "Baixa" };
const STATUS_LABEL: Record<StatusTarefa, string> = {
  pendente: "Pendente",
  em_progresso: "Em progresso",
  concluida: "Concluída",
  atrasada: "Atrasada",
};

function badgeStatus(status: StatusTarefa) {
  const base = "rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const map: Record<StatusTarefa, string> = {
    pendente: "bg-secondary text-secondary-foreground",
    em_progresso: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    concluida: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    atrasada: "bg-destructive/15 text-destructive",
  };
  return `${base} ${map[status]}`;
}

function badgePrioridade(p: Prioridade) {
  const map: Record<Prioridade, string> = {
    alta: "text-destructive",
    media: "text-amber-500",
    baixa: "text-emerald-500",
  };
  return map[p];
}

function Tarefas() {
  const { user } = Route.useRouteContext();
  const [tarefas, setTarefas] = useState<Tarefa[]>(TAREFAS);
  const [busca, setBusca] = useState("");
  const [filtroModo, setFiltroModo] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [criando, setCriando] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaModo, setNovaModo] = useState(MODOS[0]?.id || "");
  const [novaPrioridade, setNovaPrioridade] = useState<Prioridade>("media");
  const [novoPrazo, setNovoPrazo] = useState(new Date().toISOString().split("T")[0]);
  const [expandida, setExpandida] = useState<string | null>(null);

  const filtradas = tarefas.filter((t) => {
    if (busca && !t.titulo.toLowerCase().includes(busca.toLowerCase())) return false;
    if (filtroModo !== "todos" && t.modoId !== filtroModo) return false;
    if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
    return true;
  });

  function concluir(id: string) {
    setTarefas((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "concluida" ? "pendente" : "concluida", concluidaEm: new Date().toISOString().split("T")[0] }
          : t,
      ),
    );
  }

  function excluir(id: string) {
    setTarefas((prev) => prev.filter((t) => t.id !== id));
  }

  function criarTarefa() {
    if (!novoTitulo.trim()) return;
    const nova: Tarefa = {
      id: `t${Date.now()}`,
      titulo: novoTitulo.trim(),
      modoId: novaModo,
      prazo: novoPrazo,
      prioridade: novaPrioridade,
      status: "pendente",
      subtarefas: [],
    };
    setTarefas((prev) => [nova, ...prev]);
    setNovoTitulo("");
    setCriando(false);
  }

  return (
    <AppLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Tarefas</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtradas.length} tarefas encontradas</p>
        </div>
        <Button onClick={() => setCriando(true)} className="gap-2 sm:shrink-0">
          <Plus size={16} /> Nova tarefa
        </Button>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar tarefas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-xl border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filtroModo}
          onChange={(e) => setFiltroModo(e.target.value)}
          className="rounded-xl border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="todos">Todos os modos</option>
          {MODOS.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
        </select>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded-xl border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="todos">Todos os status</option>
          {(["pendente", "em_progresso", "atrasada", "concluida"] as StatusTarefa[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {/* Form criação */}
      {criando && (
        <div className="mb-6 rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Nova tarefa</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">TÍTULO</label>
              <input
                type="text"
                value={novoTitulo}
                onChange={(e) => setNovoTitulo(e.target.value)}
                placeholder="O que precisa ser feito?"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && criarTarefa()}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">MODO</label>
              <select
                value={novaModo}
                onChange={(e) => setNovaModo(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {MODOS.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">PRAZO</label>
              <input
                type="date"
                value={novoPrazo}
                onChange={(e) => setNovoPrazo(e.target.value)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">PRIORIDADE</label>
              <select
                value={novaPrioridade}
                onChange={(e) => setNovaPrioridade(e.target.value as Prioridade)}
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="alta">Alta</option>
                <option value="media">Média</option>
                <option value="baixa">Baixa</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={criarTarefa} disabled={!novoTitulo.trim()}>Criar tarefa</Button>
            <Button variant="ghost" onClick={() => setCriando(false)}>Cancelar</Button>
          </div>
        </div>
      )}

      {/* Lista de tarefas */}
      <div className="space-y-2">
        {filtradas.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-12 text-center">
            <Filter className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhuma tarefa encontrada.</p>
          </div>
        ) : (
          filtradas.map((t) => {
            const modo = MODOS.find((m) => m.id === t.modoId);
            const isExpand = expandida === t.id;
            return (
              <div
                key={t.id}
                className="rounded-2xl border bg-card transition-shadow hover:shadow-sm"
              >
                <div
                  className="flex cursor-pointer items-center gap-3 p-4"
                  onClick={() => setExpandida(isExpand ? null : t.id)}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); concluir(t.id); }}
                    className="shrink-0 text-primary transition-transform hover:scale-110"
                  >
                    {t.status === "concluida"
                      ? <CheckCircle2 size={20} className="text-emerald-500" />
                      : t.status === "atrasada"
                      ? <AlertTriangle size={20} className="text-destructive" />
                      : <Circle size={20} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <span className={`text-sm font-medium ${t.status === "concluida" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {t.titulo}
                    </span>
                    {t.descricao && <p className="mt-0.5 truncate text-xs text-muted-foreground">{t.descricao}</p>}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {modo && (
                      <span className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold text-white sm:inline" style={{ background: modo.cor }}>
                        {modo.nome}
                      </span>
                    )}
                    <span className={`hidden text-xs font-semibold sm:inline ${badgePrioridade(t.prioridade)}`}>
                      {PRIORIDADE_LABEL[t.prioridade]}
                    </span>
                    <span className={badgeStatus(t.status)}>{STATUS_LABEL[t.status]}</span>
                    <span className="text-xs text-muted-foreground">{new Date(t.prazo + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); excluir(t.id); }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {isExpand && t.subtarefas.length > 0 && (
                  <div className="border-t border-border px-4 pb-4 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subtarefas</p>
                    <ul className="space-y-1.5">
                      {t.subtarefas.map((s) => (
                        <li key={s.id} className="flex items-center gap-2 text-sm">
                          {s.concluida ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} className="text-muted-foreground" />}
                          <span className={s.concluida ? "line-through text-muted-foreground" : "text-foreground"}>{s.titulo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}
