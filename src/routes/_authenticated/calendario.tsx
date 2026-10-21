import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { TAREFAS, MODOS } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/calendario")({
  head: () => ({ meta: [{ title: "Calendário — Modo" }] }),
  component: Calendario,
});

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function Calendario() {
  const { user } = Route.useRouteContext();
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [visao, setVisao] = useState<"mensal" | "semanal">("mensal");

  function navMes(delta: number) {
    let m = mes + delta;
    let a = ano;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMes(m);
    setAno(a);
  }

  // Dias do mês
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  // Tarefas indexadas por data
  const tarefasPorDia: Record<string, typeof TAREFAS> = {};
  TAREFAS.forEach((t) => {
    const d = t.prazo.slice(0, 10);
    if (!tarefasPorDia[d]) tarefasPorDia[d] = [];
    tarefasPorDia[d].push(t);
  });

  // Semana atual (para visão semanal)
  const inicioSemana = new Date(hoje);
  inicioSemana.setDate(hoje.getDate() - hoje.getDay());
  const diasSemana = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(inicioSemana);
    d.setDate(inicioSemana.getDate() + i);
    return d;
  });

  return (
    <AppLayout user={user}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Calendário</h1>
          <p className="mt-1 text-sm text-muted-foreground">Veja seus prazos e tarefas no tempo.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={visao === "mensal" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisao("mensal")}
          >Mensal</Button>
          <Button
            variant={visao === "semanal" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisao("semanal")}
          >Semanal</Button>
        </div>
      </div>

      {/* Navegação */}
      {visao === "mensal" && (
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navMes(-1)}><ChevronLeft size={18} /></Button>
          <h2 className="font-display text-xl font-semibold text-foreground">{MESES[mes]} {ano}</h2>
          <Button variant="ghost" size="icon" onClick={() => navMes(1)}><ChevronRight size={18} /></Button>
        </div>
      )}

      {visao === "semanal" && (
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Semana de {inicioSemana.toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
          </h2>
        </div>
      )}

      {/* Visão mensal */}
      {visao === "mensal" && (
        <div className="rounded-2xl border bg-card overflow-hidden">
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 border-b border-border">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {d}
              </div>
            ))}
          </div>
          {/* Dias */}
          <div className="grid grid-cols-7">
            {Array.from({ length: primeiroDia }, (_, i) => (
              <div key={`empty-${i}`} className="border-b border-r border-border bg-secondary/20 p-2 min-h-[90px]" />
            ))}
            {Array.from({ length: totalDias }, (_, i) => {
              const dia = i + 1;
              const isoDate = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
              const isHoje = hoje.getFullYear() === ano && hoje.getMonth() === mes && hoje.getDate() === dia;
              const tDia = tarefasPorDia[isoDate] || [];
              return (
                <div key={dia} className={`min-h-[90px] border-b border-r border-border p-2 ${isHoje ? "bg-primary/5" : ""}`}>
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                    isHoje ? "bg-primary text-primary-foreground" : "text-foreground"
                  }`}>{dia}</span>
                  <div className="mt-1 space-y-0.5">
                    {tDia.slice(0, 2).map((t) => {
                      const modo = MODOS.find((m) => m.id === t.modoId);
                      return (
                        <div
                          key={t.id}
                          className="truncate rounded px-1 py-0.5 text-[10px] font-medium text-white"
                          style={{ background: modo?.cor || "#7c3aed" }}
                          title={t.titulo}
                        >
                          {t.titulo}
                        </div>
                      );
                    })}
                    {tDia.length > 2 && (
                      <div className="text-[10px] text-muted-foreground">+{tDia.length - 2}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visão semanal */}
      {visao === "semanal" && (
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="grid grid-cols-7 divide-x divide-border">
            {diasSemana.map((d) => {
              const isoDate = d.toISOString().split("T")[0];
              const isHoje = d.toDateString() === hoje.toDateString();
              const tDia = tarefasPorDia[isoDate] || [];
              return (
                <div key={isoDate} className={`p-3 ${isHoje ? "bg-primary/5" : ""}`}>
                  <div className="mb-3 text-center">
                    <p className="text-xs text-muted-foreground">{DIAS_SEMANA[d.getDay()]}</p>
                    <span className={`mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      isHoje ? "bg-primary text-primary-foreground" : "text-foreground"
                    }`}>{d.getDate()}</span>
                  </div>
                  <div className="space-y-1.5 min-h-[120px]">
                    {tDia.map((t) => {
                      const modo = MODOS.find((m) => m.id === t.modoId);
                      return (
                        <div
                          key={t.id}
                          className="rounded-lg px-2 py-1.5 text-[11px] font-medium text-white"
                          style={{ background: modo?.cor || "#7c3aed" }}
                          title={t.titulo}
                        >
                          <span className="line-clamp-2">{t.titulo}</span>
                        </div>
                      );
                    })}
                    {tDia.length === 0 && (
                      <div className="flex h-20 items-center justify-center">
                        <span className="text-[10px] text-muted-foreground/40">–</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="mt-6 flex flex-wrap gap-3">
        {MODOS.map((m) => (
          <div key={m.id} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: m.cor }} />
            <span className="text-xs text-muted-foreground">{m.nome}</span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
