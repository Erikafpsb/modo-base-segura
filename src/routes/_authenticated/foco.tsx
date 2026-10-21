import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, SkipForward, Timer } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { TAREFAS, SESSOES_FOCO } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/foco")({
  head: () => ({ meta: [{ title: "Foco — Modo" }] }),
  component: Foco,
});

type Fase = "foco" | "pausa" | "pausa_longa";

const CONFIGS = {
  foco: 25,
  pausa: 5,
  pausa_longa: 15,
};

function Foco() {
  const { user } = Route.useRouteContext();

  const [fase, setFase] = useState<Fase>("foco");
  const [duracaoFoco, setDuracaoFoco] = useState(25);
  const [duracaoPausa, setDuracaoPausa] = useState(5);
  const [segundos, setSegundos] = useState(duracaoFoco * 60);
  const [rodando, setRodando] = useState(false);
  const [ciclos, setCiclos] = useState(0);
  const [tarefaSelecionada, setTarefaSelecionada] = useState("");
  const [sessoes, setSessoes] = useState(SESSOES_FOCO);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = (fase === "foco" ? duracaoFoco : fase === "pausa" ? duracaoPausa : CONFIGS.pausa_longa) * 60;
  const pct = ((total - segundos) / total) * 100;
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;

  useEffect(() => {
    if (rodando) {
      intervalRef.current = setInterval(() => {
        setSegundos((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRodando(false);
            if (fase === "foco") {
              setCiclos((c) => c + 1);
              setSessoes((prev) => [
                {
                  id: `sf${Date.now()}`,
                  tarefaId: tarefaSelecionada || undefined,
                  duracaoMin: duracaoFoco,
                  concluidaEm: new Date().toISOString().split("T")[0],
                },
                ...prev,
              ]);
              const novaFase: Fase = (ciclos + 1) % 4 === 0 ? "pausa_longa" : "pausa";
              setFase(novaFase);
              setSegundos((novaFase === "pausa_longa" ? CONFIGS.pausa_longa : duracaoPausa) * 60);
            } else {
              setFase("foco");
              setSegundos(duracaoFoco * 60);
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [rodando, fase, duracaoFoco, duracaoPausa, ciclos, tarefaSelecionada]);

  function reiniciar() {
    setRodando(false);
    setFase("foco");
    setSegundos(duracaoFoco * 60);
    setCiclos(0);
  }

  function pular() {
    setRodando(false);
    if (fase === "foco") {
      const novaFase: Fase = ciclos % 4 === 3 ? "pausa_longa" : "pausa";
      setFase(novaFase);
      setSegundos((novaFase === "pausa_longa" ? CONFIGS.pausa_longa : duracaoPausa) * 60);
    } else {
      setFase("foco");
      setSegundos(duracaoFoco * 60);
    }
  }

  const corFase = fase === "foco" ? "text-primary" : fase === "pausa" ? "text-emerald-500" : "text-cyan-500";
  const bgFase = fase === "foco" ? "bg-primary" : fase === "pausa" ? "bg-emerald-500" : "bg-cyan-500";

  const sessoesHoje = sessoes.filter((s) => s.concluidaEm === new Date().toISOString().split("T")[0]);
  const minFocoHoje = sessoesHoje.reduce((a, s) => a + s.duracaoMin, 0);

  return (
    <AppLayout user={user}>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">Temporizador de Foco</h1>
        <p className="mt-1 text-sm text-muted-foreground">Concentre-se. Um bloco de tempo por vez.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timer */}
        <div className="flex flex-col items-center rounded-2xl border bg-card p-8">
          {/* Fase */}
          <div className="mb-6 flex gap-2">
            {(["foco", "pausa", "pausa_longa"] as Fase[]).map((f) => (
              <button
                key={f}
                onClick={() => { if (!rodando) { setFase(f); setSegundos((f === "foco" ? duracaoFoco : f === "pausa" ? duracaoPausa : CONFIGS.pausa_longa) * 60); } }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${fase === f ? `${bgFase} text-white` : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                {f === "foco" ? "Foco" : f === "pausa" ? "Pausa" : "Pausa longa"}
              </button>
            ))}
          </div>

          {/* Círculo */}
          <div className="relative mb-8 flex h-52 w-52 items-center justify-center">
            <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--color-secondary)" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
                className={`${corFase} transition-all duration-1000`}
              />
            </svg>
            <div className="text-center">
              <div className={`font-display text-5xl font-bold tabular-nums ${corFase}`}>
                {String(minutos).padStart(2, "0")}:{String(segs).padStart(2, "0")}
              </div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {fase === "foco" ? "Foco" : fase === "pausa" ? "Pausa curta" : "Pausa longa"}
              </div>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={reiniciar} title="Reiniciar">
              <RotateCcw size={18} />
            </Button>
            <Button
              size="lg"
              className={`h-14 w-14 rounded-full ${bgFase} text-white shadow-lg hover:opacity-90`}
              onClick={() => setRodando((r) => !r)}
            >
              {rodando ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={pular} title="Pular fase">
              <SkipForward size={18} />
            </Button>
          </div>

          {/* Ciclos */}
          <div className="mt-6 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-all ${i < (ciclos % 4) ? bgFase : "bg-secondary"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{ciclos} sessões concluídas hoje</p>

          {/* Tarefa */}
          <div className="mt-6 w-full">
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">TAREFA VINCULADA</label>
            <select
              value={tarefaSelecionada}
              onChange={(e) => setTarefaSelecionada(e.target.value)}
              className="w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sem tarefa</option>
              {TAREFAS.filter((t) => t.status !== "concluida").map((t) => (
                <option key={t.id} value={t.id}>{t.titulo}</option>
              ))}
            </select>
          </div>

          {/* Configurações */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">FOCO ({duracaoFoco}min)</label>
              <input type="range" min={5} max={90} step={5} value={duracaoFoco} disabled={rodando}
                onChange={(e) => { const v = Number(e.target.value); setDuracaoFoco(v); if (!rodando && fase === "foco") setSegundos(v * 60); }}
                className="w-full accent-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">PAUSA ({duracaoPausa}min)</label>
              <input type="range" min={1} max={30} step={1} value={duracaoPausa} disabled={rodando}
                onChange={(e) => { const v = Number(e.target.value); setDuracaoPausa(v); if (!rodando && fase === "pausa") setSegundos(v * 60); }}
                className="w-full accent-primary" />
            </div>
          </div>
        </div>

        {/* Histórico de hoje */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Hoje</h2>
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl bg-secondary/60 p-3 text-center">
                <div className="text-2xl font-bold text-primary">{sessoesHoje.length}</div>
                <div className="text-xs text-muted-foreground">sessões</div>
              </div>
              <div className="flex-1 rounded-xl bg-secondary/60 p-3 text-center">
                <div className="text-2xl font-bold text-primary">{minFocoHoje}</div>
                <div className="text-xs text-muted-foreground">minutos</div>
              </div>
            </div>
          </div>

          <div className="flex-1 rounded-2xl border bg-card p-5">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Histórico recente</h2>
            {sessoesHoje.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <Timer className="mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Nenhuma sessão ainda. Comece agora!</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {sessoesHoje.map((s) => {
                  const tarefa = TAREFAS.find((t) => t.id === s.tarefaId);
                  return (
                    <li key={s.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 px-3 py-2.5">
                      <Timer size={14} className="shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{tarefa?.titulo || "Sessão livre"}</p>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-primary">{s.duracaoMin}min</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
