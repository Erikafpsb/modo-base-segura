import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layers, Plus, Archive, Trash2, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { MODOS, TAREFAS, type Modo } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/modos")({
  head: () => ({ meta: [{ title: "Modos — Modo" }] }),
  component: Modos,
});

const ICONES: Record<string, string> = {
  briefcase: "💼",
  "book-open": "📖",
  heart: "❤️",
  dumbbell: "🏋️",
  star: "⭐",
  home: "🏠",
  music: "🎵",
  code: "💻",
};

function Modos() {
  const { user } = Route.useRouteContext();
  const [modos, setModos] = useState<Modo[]>(MODOS);
  const [criando, setCriando] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaCor, setNovaCor] = useState("#7c3aed");
  const [excluirId, setExcluirId] = useState<string | null>(null);

  const ativos = modos.filter((m) => !m.arquivado);
  const arquivados = modos.filter((m) => m.arquivado);

  function criarModo() {
    if (!novoNome.trim()) return;
    const novo: Modo = {
      id: `m${Date.now()}`,
      nome: novoNome.trim(),
      cor: novaCor,
      icone: "star",
      arquivado: false,
      totalTarefas: 0,
      tarefasConcluidas: 0,
    };
    setModos((prev) => [...prev, novo]);
    setNovoNome("");
    setCriando(false);
  }

  function arquivar(id: string) {
    setModos((prev) => prev.map((m) => (m.id === id ? { ...m, arquivado: !m.arquivado } : m)));
  }

  function excluir(id: string) {
    setModos((prev) => prev.filter((m) => m.id !== id));
    setExcluirId(null);
  }

  return (
    <AppLayout user={user}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Modos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize suas atividades em espaços separados.</p>
        </div>
        <Button onClick={() => setCriando(true)} className="gap-2">
          <Plus size={16} /> Novo modo
        </Button>
      </div>

      {/* Form de criação */}
      {criando && (
        <div className="mb-6 rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold">Novo modo</h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">NOME</label>
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="ex: Projetos pessoais"
                className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                onKeyDown={(e) => e.key === "Enter" && criarModo()}
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">COR</label>
              <input
                type="color"
                value={novaCor}
                onChange={(e) => setNovaCor(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-xl border bg-background p-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={criarModo} disabled={!novoNome.trim()}>Criar</Button>
              <Button variant="ghost" onClick={() => setCriando(false)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modos ativos */}
      <div className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Ativos — {ativos.length}
        </h2>
        {ativos.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card/50 p-10 text-center">
            <Layers className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Nenhum modo ativo. Crie o primeiro!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ativos.map((modo) => {
              const tarefasModo = TAREFAS.filter((t) => t.modoId === modo.id);
              const concluidas = tarefasModo.filter((t) => t.status === "concluida").length;
              const pct = tarefasModo.length > 0 ? Math.round((concluidas / tarefasModo.length) * 100) : 0;
              return (
                <div key={modo.id} className="group rounded-2xl border bg-card p-5 transition-shadow hover:shadow-soft">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                        style={{ background: modo.cor + "22" }}
                      >
                        {ICONES[modo.icone] || "📁"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{modo.nome}</h3>
                        <p className="text-xs text-muted-foreground">{tarefasModo.length} tarefas</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => arquivar(modo.id)}
                        title="Arquivar"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <Archive size={15} />
                      </button>
                      <button
                        onClick={() => setExcluirId(modo.id)}
                        title="Excluir"
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp size={11} /> {concluidas}/{tarefasModo.length} concluídas
                      </span>
                      <span className="text-xs font-semibold" style={{ color: modo.cor }}>{pct}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: modo.cor }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modos arquivados */}
      {arquivados.length > 0 && (
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Arquivados — {arquivados.length}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {arquivados.map((modo) => (
              <div key={modo.id} className="group flex items-center gap-3 rounded-2xl border border-dashed bg-card/60 p-4 opacity-60">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl text-lg" style={{ background: modo.cor + "22" }}>
                  {ICONES[modo.icone] || "📁"}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{modo.nome}</span>
                <button
                  onClick={() => arquivar(modo.id)}
                  className="text-xs text-primary underline-offset-2 hover:underline"
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {excluirId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-2xl">
            <h3 className="font-display text-lg font-semibold text-foreground">Excluir modo?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta ação não pode ser desfeita. As tarefas vinculadas a este modo permanecerão.
            </p>
            <div className="mt-5 flex gap-3">
              <Button variant="destructive" className="flex-1" onClick={() => excluir(excluirId)}>Excluir</Button>
              <Button variant="outline" className="flex-1" onClick={() => setExcluirId(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
