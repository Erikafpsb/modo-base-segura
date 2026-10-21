// ---------------------------------------------------------------------------
// Dados fictícios do Modo — substitua por chamadas ao banco real no futuro.
// ---------------------------------------------------------------------------

export type Prioridade = "baixa" | "media" | "alta";
export type StatusTarefa = "pendente" | "em_progresso" | "concluida" | "atrasada";

export type Modo = {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  arquivado: boolean;
  totalTarefas: number;
  tarefasConcluidas: number;
};

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  modoId: string;
  prazo: string; // ISO date string
  prioridade: Prioridade;
  status: StatusTarefa;
  concluidaEm?: string;
  subtarefas: Subtarefa[];
};

export type Subtarefa = {
  id: string;
  titulo: string;
  concluida: boolean;
};

export type Habito = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  frequencia: "diario" | "semanal";
  registros: string[]; // datas ISO que foram marcadas
};

export type Meta = {
  id: string;
  titulo: string;
  prazo: string;
  progresso: number; // 0–100
  descricao?: string;
};

export type SessaoFoco = {
  id: string;
  tarefaId?: string;
  duracaoMin: number;
  concluidaEm: string;
};

// ---------------------------------------------------------------------------
// Modos fictícios
// ---------------------------------------------------------------------------

export const MODOS: Modo[] = [
  { id: "m1", nome: "Trabalho", cor: "#7c3aed", icone: "briefcase", arquivado: false, totalTarefas: 6, tarefasConcluidas: 2 },
  { id: "m2", nome: "Estudos", cor: "#0891b2", icone: "book-open", arquivado: false, totalTarefas: 4, tarefasConcluidas: 1 },
];

// ---------------------------------------------------------------------------
// Tarefas fictícias
// ---------------------------------------------------------------------------

const hoje = new Date();
const amanha = new Date(hoje); amanha.setDate(hoje.getDate() + 1);
const ontem = new Date(hoje); ontem.setDate(hoje.getDate() - 1);
const semanaQue = new Date(hoje); semanaQue.setDate(hoje.getDate() + 7);
const h = (d: Date) => d.toISOString().split("T")[0];

export const TAREFAS: Tarefa[] = [
  {
    id: "t1", titulo: "Revisar proposta comercial", descricao: "Verificar valores e prazos antes de enviar ao cliente.",
    modoId: "m1", prazo: h(amanha), prioridade: "alta", status: "em_progresso",
    subtarefas: [
      { id: "s1", titulo: "Checar valores", concluida: true },
      { id: "s2", titulo: "Revisar prazo de entrega", concluida: false },
    ],
  },
  {
    id: "t2", titulo: "Atualizar relatório mensal",
    modoId: "m1", prazo: h(ontem), prioridade: "alta", status: "atrasada",
    subtarefas: [],
  },
  {
    id: "t3", titulo: "Reunião com equipe de design",
    modoId: "m1", prazo: h(hoje), prioridade: "media", status: "pendente",
    subtarefas: [],
  },
  {
    id: "t4", titulo: "Enviar feedback sprint",
    modoId: "m1", prazo: h(semanaQue), prioridade: "baixa", status: "pendente",
    subtarefas: [],
  },
  {
    id: "t5", titulo: "Configurar ambiente dev",
    modoId: "m1", prazo: h(semanaQue), prioridade: "media", status: "concluida", concluidaEm: h(ontem),
    subtarefas: [{ id: "s3", titulo: "Instalar dependências", concluida: true }],
  },
  {
    id: "t6", titulo: "Documentar API",
    modoId: "m1", prazo: h(semanaQue), prioridade: "baixa", status: "concluida", concluidaEm: h(hoje),
    subtarefas: [],
  },
  {
    id: "t7", titulo: "Ler capítulo 3 — TypeScript avançado",
    modoId: "m2", prazo: h(amanha), prioridade: "alta", status: "em_progresso",
    subtarefas: [],
  },
  {
    id: "t8", titulo: "Fazer exercícios da aula 12",
    modoId: "m2", prazo: h(hoje), prioridade: "media", status: "pendente",
    subtarefas: [],
  },
  {
    id: "t9", titulo: "Revisar anotações de SQL",
    modoId: "m2", prazo: h(semanaQue), prioridade: "baixa", status: "pendente",
    subtarefas: [],
  },
  {
    id: "t10", titulo: "Assistir palestra sobre React 19",
    modoId: "m2", prazo: h(ontem), prioridade: "media", status: "concluida", concluidaEm: h(ontem),
    subtarefas: [],
  },
];

// ---------------------------------------------------------------------------
// Hábitos fictícios
// ---------------------------------------------------------------------------

const diasRecentes = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(hoje); d.setDate(hoje.getDate() - i); return h(d);
});

export const HABITOS: Habito[] = [
  { id: "h1", nome: "Beber 2L de água", icone: "droplets", cor: "#0891b2", frequencia: "diario", registros: [diasRecentes[0], diasRecentes[1], diasRecentes[2], diasRecentes[4]] },
  { id: "h2", nome: "Meditar 10 minutos", icone: "heart", cor: "#7c3aed", frequencia: "diario", registros: [diasRecentes[0], diasRecentes[1], diasRecentes[3]] },
  { id: "h3", nome: "Ler pelo menos 20 páginas", icone: "book-open", cor: "#0d9488", frequencia: "diario", registros: [diasRecentes[0], diasRecentes[2]] },
  { id: "h4", nome: "Exercício físico", icone: "dumbbell", cor: "#ea580c", frequencia: "diario", registros: [diasRecentes[1], diasRecentes[3], diasRecentes[5]] },
];

// ---------------------------------------------------------------------------
// Metas fictícias
// ---------------------------------------------------------------------------

export const METAS: Meta[] = [
  { id: "mt1", titulo: "Concluir curso de TypeScript", prazo: "2026-12-31", progresso: 40, descricao: "Finalizar todos os módulos e projeto final." },
  { id: "mt2", titulo: "Ler 12 livros no ano", prazo: "2026-12-31", progresso: 58, descricao: "Um livro por mês." },
  { id: "mt3", titulo: "Correr 5km sem parar", prazo: "2026-11-30", progresso: 70 },
];

// ---------------------------------------------------------------------------
// Sessões de foco fictícias (últimos 7 dias)
// ---------------------------------------------------------------------------

export const SESSOES_FOCO: SessaoFoco[] = [
  { id: "sf1", tarefaId: "t1", duracaoMin: 25, concluidaEm: diasRecentes[0] },
  { id: "sf2", tarefaId: "t7", duracaoMin: 25, concluidaEm: diasRecentes[0] },
  { id: "sf3", tarefaId: "t1", duracaoMin: 25, concluidaEm: diasRecentes[1] },
  { id: "sf4", tarefaId: "t3", duracaoMin: 50, concluidaEm: diasRecentes[2] },
  { id: "sf5", tarefaId: "t7", duracaoMin: 25, concluidaEm: diasRecentes[3] },
  { id: "sf6", tarefaId: "t8", duracaoMin: 25, concluidaEm: diasRecentes[4] },
  { id: "sf7", tarefaId: "t2", duracaoMin: 25, concluidaEm: diasRecentes[5] },
];

// ---------------------------------------------------------------------------
// Plano do usuário demo
// ---------------------------------------------------------------------------

export const PLANO_USUARIO: "gratis" | "premium" = "gratis";
