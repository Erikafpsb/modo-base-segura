import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Crown,
  Check,
  X,
  Sparkles,
  Info,
  Layers,
  CheckSquare,
  Flame,
  Palette,
  BarChart2,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { PLANO_USUARIO } from "@/lib/mock-data";

export const Route = createFileRoute("/_authenticated/planos")({
  head: () => ({
    meta: [
      { title: "Planos & Assinatura — Modo" },
      { name: "description", content: "Compare os planos Grátis e Premium do Modo." },
    ],
  }),
  component: Planos,
});

export function Planos() {
  const { user } = Route.useRouteContext();
  const [frequencia, setFrequencia] = useState<"mensal" | "anual">("mensal");
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <AppLayout user={user}>
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
          <Sparkles size={14} />
          <span>Escolha o plano ideal para a sua rotina</span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground md:text-5xl">
          Produtividade sem estresse
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
          Comece gratuitamente e avance para o Premium quando precisar de modos ilimitados, temas exclusivos e estatísticas completas.
        </p>

        {/* Toggle Mensal / Anual */}
        <div className="mt-8 inline-flex items-center rounded-2xl border border-border bg-card p-1 shadow-sm">
          <button
            onClick={() => setFrequencia("mensal")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              frequencia === "mensal"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cobrança Mensal
          </button>
          <button
            onClick={() => setFrequencia("anual")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              frequencia === "anual"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Cobrança Anual</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Economize 33%
            </span>
          </button>
        </div>
      </div>

      {/* Cards de Preço */}
      <div className="mx-auto mb-16 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* Plano Grátis */}
        <div className="relative flex flex-col justify-between rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Plano Grátis</h2>
              {PLANO_USUARIO === "gratis" && (
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                  Seu Plano Atual
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Tudo o que você precisa para começar a organizar suas tarefas com clareza.
            </p>

            <div className="my-6">
              <span className="font-display text-4xl font-semibold text-foreground">R$ 0</span>
              <span className="text-sm text-muted-foreground"> / para sempre</span>
            </div>

            <ul className="space-y-3.5 border-t border-border pt-6 text-sm">
              <RecursoItem ativo texto="Até 2 modos de organização (ex: Trabalho e Estudos)" />
              <RecursoItem ativo texto="Até 10 tarefas ativas por modo" />
              <RecursoItem ativo texto="Calendário semanal e mensal básico" />
              <RecursoItem ativo texto="Rastreamento de hábitos e metas essenciais" />
              <RecursoItem ativo texto="Temporizador de foco Pomodoro padrão (25min)" />
              <RecursoItem ativo texto="Estatísticas diárias resumidas" />
              <RecursoItem ativo texto="Temas Claro, Escuro e Automático" />
              <RecursoItem ativo={false} texto="Modos e tarefas ilimitados" />
              <RecursoItem ativo={false} texto="Temas adicionais (Lavanda, Oceano, Floresta...)" />
              <RecursoItem ativo={false} texto="Histórico estendido e filtros avançados" />
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Button
              variant="outline"
              disabled
              className="w-full rounded-xl py-5 font-semibold text-muted-foreground cursor-default"
            >
              Plano em Uso
            </Button>
          </div>
        </div>

        {/* Plano Premium */}
        <div className="relative flex flex-col justify-between rounded-3xl border-2 border-primary bg-card p-8 shadow-xl">
          {/* Badge Recomendado */}
          <div className="absolute -top-3.5 right-6 rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-md">
            Mais Escolhido
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-bold text-foreground">Modo Premium</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Liberdade total, personalização refinada e acompanhamento profundo da sua rotina.
            </p>

            <div className="my-6">
              {frequencia === "mensal" ? (
                <>
                  <span className="font-display text-4xl font-semibold text-foreground">R$ 9,90</span>
                  <span className="text-sm text-muted-foreground"> / mês</span>
                </>
              ) : (
                <>
                  <span className="font-display text-4xl font-semibold text-foreground">R$ 79,90</span>
                  <span className="text-sm text-muted-foreground"> / ano (apenas R$ 6,65/mês)</span>
                </>
              )}
            </div>

            <ul className="space-y-3.5 border-t border-border pt-6 text-sm">
              <RecursoItem ativo texto="Modos ilimitados para qualquer área da vida" destaque />
              <RecursoItem ativo texto="Tarefas e subtarefas sem nenhum limite" destaque />
              <RecursoItem ativo texto="Todos os 6 temas Premium (Lavanda, Oceano, Floresta, Pôr do Sol, Rosa, Grafite)" destaque />
              <RecursoItem ativo texto="Histórico completo e relatórios ampliados" destaque />
              <RecursoItem ativo texto="Pomodoro avançado com durações personalizadas" />
              <RecursoItem ativo texto="Visualização avançada de calendário e metas com prazos" />
              <RecursoItem ativo texto="Exportação completa de backups estruturados" />
              <RecursoItem ativo texto="Prioridade em novos recursos do Modo" />
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Button
              onClick={() => setModalAberto(true)}
              className="w-full rounded-xl py-5 text-base font-semibold shadow-md transition-all hover:scale-[1.01]"
            >
              Assinar Premium
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Cancele a qualquer momento • Pagamento seguro
            </p>
          </div>
        </div>
      </div>

      {/* Tabela comparativa */}
      <div className="mx-auto mb-16 max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h3 className="mb-6 font-display text-2xl font-semibold text-foreground">
          Comparação detalhada de recursos
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="pb-3 font-semibold">Funcionalidade</th>
                <th className="pb-3 text-center font-semibold">Grátis</th>
                <th className="pb-3 text-center font-semibold text-primary">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              <TabelaLinha
                nome="Limite de Modos"
                gratis="Até 2 modos"
                premium="Ilimitados"
              />
              <TabelaLinha
                nome="Limite de Tarefas"
                gratis="Até 10 por modo"
                premium="Ilimitadas"
              />
              <TabelaLinha
                nome="Subtarefas por tarefa"
                gratis="Básico"
                premium="Ilimitadas"
              />
              <TabelaLinha
                nome="Temas Visuais"
                gratis="3 temas (Claro, Escuro, Auto)"
                premium="Todos os 9 temas"
              />
              <TabelaLinha
                nome="Visualizações de Calendário"
                gratis="Semanal & Mensal"
                premium="Semanal, Mensal & Filtros"
              />
              <TabelaLinha
                nome="Temporizador Pomodoro"
                gratis="Tempo padrão (25min)"
                premium="Personalizável + Histórico"
              />
              <TabelaLinha
                nome="Relatórios & Estatísticas"
                gratis="Últimos 7 dias"
                premium="Histórico ilimitado"
              />
              <TabelaLinha
                nome="Hábitos e Metas"
                gratis="Até 4 hábitos"
                premium="Ilimitados"
              />
              <TabelaLinha
                nome="Exportação de Dados"
                gratis="JSON"
                premium="JSON & Relatórios"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto max-w-3xl space-y-4">
        <h3 className="mb-6 text-center font-display text-2xl font-semibold text-foreground">
          Perguntas Frequentes
        </h3>

        <FaqItem
          pergunta="Posso usar o Modo de graça para sempre?"
          resposta="Sim! O plano Grátis não expira e não exige cartão de crédito. Você pode organizar até 2 modos e 10 tarefas por modo com total comodidade."
        />
        <FaqItem
          pergunta="Como funciona a cobrança do plano anual?"
          resposta="No plano anual você faz um pagamento único de R$ 79,90 válido por 12 meses, economizando 33% em relação ao valor da mensalidade tradicional."
        />
        <FaqItem
          pergunta="O que acontece com minhas tarefas se eu cancelar o Premium?"
          resposta="Seus dados ficam preservados e salvos na sua conta. Você apenas volta a ter os limites de criação do plano Grátis."
        />
        <FaqItem
          pergunta="Como posso pagar?"
          resposta="Serão aceitos pagamentos via Pix e cartão de crédito assim que a plataforma de cobrança estiver ativa."
        />
      </div>

      {/* Modal / Dialog Informativo Conforme PRD */}
      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setModalAberto(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Info size={24} />
            </div>

            <h4 className="font-display text-xl font-semibold text-foreground">
              Novidade a caminho!
            </h4>

            <p className="mt-2 text-sm text-muted-foreground">
              A contratação do plano <strong>Premium</strong> será disponibilizada futuramente, assim que a integração de pagamentos estiver concluída.
            </p>

            <div className="mt-4 rounded-xl bg-secondary/60 p-3.5 text-xs text-muted-foreground">
              <ShieldCheck className="mb-1 h-4 w-4 text-emerald-500 inline mr-1" />
              Nenhum valor foi cobrado. Você já pode aproveitar todas as telas e recursos do Modo com dados demonstrativos!
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setModalAberto(false)} className="rounded-xl">
                Entendido
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function RecursoItem({
  ativo,
  texto,
  destaque,
}: {
  ativo: boolean;
  texto: string;
  destaque?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      {ativo ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <Check size={12} strokeWidth={3} />
        </span>
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <X size={12} />
        </span>
      )}
      <span
        className={`${
          ativo ? (destaque ? "font-medium text-foreground" : "text-foreground") : "text-muted-foreground line-through opacity-75"
        }`}
      >
        {texto}
      </span>
    </li>
  );
}

function TabelaLinha({
  nome,
  gratis,
  premium,
}: {
  nome: string;
  gratis: string;
  premium: string;
}) {
  return (
    <tr className="hover:bg-secondary/30 transition-colors">
      <td className="py-3 font-medium text-foreground">{nome}</td>
      <td className="py-3 text-center text-muted-foreground">{gratis}</td>
      <td className="py-3 text-center font-semibold text-primary">{premium}</td>
    </tr>
  );
}

function FaqItem({
  pergunta,
  resposta,
}: {
  pergunta: string;
  resposta: string;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div
      onClick={() => setAberto(!aberto)}
      className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition-colors hover:border-border/80"
    >
      <div className="flex items-center justify-between font-medium text-foreground">
        <span>{pergunta}</span>
        <span className="text-muted-foreground text-sm">{aberto ? "−" : "+"}</span>
      </div>
      {aberto && (
        <p className="mt-2 text-sm text-muted-foreground animate-in fade-in duration-150">
          {resposta}
        </p>
      )}
    </div>
  );
}
