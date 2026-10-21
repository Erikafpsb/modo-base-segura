import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CheckCircle2, Circle, Trash2, Target, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { HABITOS, METAS, type Habito, type Meta } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/habitos")({
  head: () => ({ meta: [{ title: "Hábitos & Metas — Modo" }] }),
  component: Habitos,
});

const ICONES_HABITOS: Record<string, string> = {
  droplets: "💧", heart: "❤️", "book-open": "📖", dumbbell: "🏋️",
  sun: "☀️", moon: "🌙", apple: "🍎", music: "🎵",
};

function Habitos() {
  const { user } = Route.useRouteContext();
  const hoje = new Date().toISOString().split("T")[0];

  const [habitos, setHabitos] = useState<Habito[]>(HABITOS);
  const [metas, setMetas] = useState<Meta[]>(METAS);
  const [aba, setAba] = useState<"habitos" | "metas">("habitos");

  // Criar hábito
  const [criandoHabito, setCriandoHabito] = useState(false);
  const [novoHabito, setNovoHabito] = useState("");
  const [novaCor, setNovaCor] = useState("#7c3aed");

  // Criar meta
  const [criandoMeta, setCriandoMeta] = useState(false);
  const [novoMetaTitulo, setNovoMetaTitulo] = useState("");
  const [novoMetaPrazo, setNovoMetaPrazo] = useState("");
  const [novoMetaProgresso, setNovoMetaProgresso] = useState(0);

  function toggleHabito(id: string) {
    setHabitos((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const registros = h.registros.includes(hoje)
          ? h.registros.filter((r) => r !== hoje)
          : [...h.registros, hoje];
        return { ...h, registros };
      }),
    );
  }

  function criarHabito() {
    if (!novoHabito.trim()) return;
    const novo: Habito = {
      id: `h${Date.now()}`,
      nome: novoHabito.trim(),
      icone: "heart",
      cor: novaCor,
      frequencia: "diario",
      registros: [],
    };
    setHabitos((prev) => [...prev, novo]);
    setNovoHabito("");
    setCriandoHabito(false);
  }

  function criarMeta() {
    if (!novoMetaTitulo.trim() || !novoMetaPrazo) return;
    const nova: Meta = {
      id: `mt${Date.now()}`,
      titulo: novoMetaTitulo.trim(),
      prazo: novoMetaPrazo,
      progresso: novoMetaProgresso,
    };
    setMetas((prev) => [...prev, nova]);
    setNovoMetaTitulo("");
    setNovoMetaPrazo("");
    setNovoMetaProgresso(0);
    setCriandoMeta(false);
  }

  // Últimos 7 dias para histórico
  const ultimos7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  return (
    <AppLayout user={user}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Hábitos & Metas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Construa sua melhor rotina, um dia por vez.</p>
        </div>
        <Button onClick={() => aba === "habitos" ? setCriandoHabito(true) : setCriandoMeta(true)} className="gap-2">
          <Plus size={16} /> Novo
        </Button>
      </div>

      {/* Abas */}
      <div className="mb-6 flex gap-1 rounded-xl border bg-card p-1">
        <button
          onClick={() => setAba("habitos")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${aba === "habitos" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Hábitos
        </button>
        <button
          onClick={() => setAba("metas")}
          className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${aba === "metas" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          Metas
        </button>
      </div>

      {/* Hábitos */}
      {aba === "habitos" && (
        <div className="space-y-4">
          {criandoHabito && (
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold">Novo hábito</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={novoHabito}
                  onChange={(e) => setNovoHabito(e.target.value)}
                  placeholder="ex: Beber água"
                  className="flex-1 rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && criarHabito()}
                />
                <input type="color" value={novaCor} onChange={(e) => setNovaCor(e.target.value)} className="h-9 w-12 cursor-pointer rounded-xl border bg-background p-1" />
                <Button onClick={criarHabito} disabled={!novoHabito.trim()}>Criar</Button>
                <Button variant="ghost" onClick={() => setCriandoHabito(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          {habitos.map((h) => {
            const feitoHoje = h.registros.includes(hoje);
            const sequencia = ultimos7.filter((d) => h.registros.includes(d)).length;
            return (
              <div key={h.id} className="rounded-2xl border bg-card p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: h.cor + "22" }}>
                      {ICONES_HABITOS[h.icone] || "⭐"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{h.nome}</h3>
                      <p className="text-xs text-muted-foreground">{sequencia}/7 dias esta semana</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleHabito(h.id)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all ${
                      feitoHoje
                        ? "border-transparent shadow-sm"
                        : "border-dashed border-border bg-transparent hover:border-primary/50"
                    }`}
                    style={feitoHoje ? { background: h.cor } : {}}
                    title={feitoHoje ? "Desmarcar hoje" : "Marcar como feito hoje"}
                  >
                    {feitoHoje ? <CheckCircle2 size={18} className="text-white" /> : <Circle size={18} className="text-muted-foreground" />}
                  </button>
                </div>
                {/* Histórico 7 dias */}
                <div className="flex gap-1.5">
                  {ultimos7.map((d) => {
                    const feito = h.registros.includes(d);
                    const isHoje = d === hoje;
                    return (
                      <div
                        key={d}
                        title={new Date(d + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" })}
                        className={`flex-1 rounded-md transition-all ${isHoje ? "ring-2 ring-offset-1" : ""}`}
                        style={{
                          height: "24px",
                          background: feito ? h.cor : "var(--color-secondary)",
                          ringColor: h.cor,
                        }}
                      />
                    );
                  })}
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{new Date(ultimos7[0] + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}</span>
                  <span>Hoje</span>
                </div>
              </div>
            );
          })}

          {habitos.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-card/50 p-12 text-center">
              <p className="text-sm text-muted-foreground">Nenhum hábito ainda. Crie o primeiro!</p>
            </div>
          )}
        </div>
      )}

      {/* Metas */}
      {aba === "metas" && (
        <div className="space-y-4">
          {criandoMeta && (
            <div className="rounded-2xl border bg-card p-5 shadow-soft">
              <h2 className="mb-4 font-display text-lg font-semibold">Nova meta</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">TÍTULO</label>
                  <input
                    type="text"
                    value={novoMetaTitulo}
                    onChange={(e) => setNovoMetaTitulo(e.target.value)}
                    placeholder="Qual é a sua meta?"
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">PRAZO</label>
                  <input
                    type="date"
                    value={novoMetaPrazo}
                    onChange={(e) => setNovoMetaPrazo(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">PROGRESSO INICIAL ({novoMetaProgresso}%)</label>
                  <input
                    type="range"
                    min={0} max={100}
                    value={novoMetaProgresso}
                    onChange={(e) => setNovoMetaProgresso(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={criarMeta} disabled={!novoMetaTitulo.trim() || !novoMetaPrazo}>Criar meta</Button>
                <Button variant="ghost" onClick={() => setCriandoMeta(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          {metas.map((m) => {
            const diasRestantes = Math.ceil((new Date(m.prazo).getTime() - Date.now()) / 86400000);
            return (
              <div key={m.id} className="rounded-2xl border bg-card p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="shrink-0 text-primary" />
                    <h3 className="font-semibold text-foreground">{m.titulo}</h3>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-2xl font-bold text-primary">{m.progresso}%</span>
                    <span className={`text-xs ${diasRestantes < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                      {diasRestantes < 0 ? `${Math.abs(diasRestantes)}d atrasada` : `${diasRestantes}d restantes`}
                    </span>
                  </div>
                </div>
                {m.descricao && <p className="mb-3 text-sm text-muted-foreground">{m.descricao}</p>}
                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${m.progresso}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Prazo: {new Date(m.prazo + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp size={12} />
                    <span>Meta {m.progresso >= 100 ? "concluída! 🎉" : "em andamento"}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {metas.length === 0 && (
            <div className="rounded-2xl border border-dashed bg-card/50 p-12 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma meta ainda. Crie a primeira!</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
