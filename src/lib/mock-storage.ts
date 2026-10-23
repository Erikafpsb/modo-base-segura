import { MODOS, TAREFAS, HABITOS, METAS, SESSOES_FOCO } from "./mock-data";
import type { ModoRow, TarefaRow, HabitoRow, MetaRow, SessaoFocoRow } from "@/hooks/use-supabase-data";

const KEY_PREFIX = "modo_mock_db_";

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

const initialModos: ModoRow[] = MODOS.map((m) => ({
  id: m.id,
  nome: m.nome,
  cor: m.cor,
  icone: m.icone,
  arquivado: m.arquivado,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialTarefas: TarefaRow[] = TAREFAS.map((t) => ({
  id: t.id,
  modo_id: t.modoId || null,
  titulo: t.titulo,
  descricao: t.descricao || null,
  prazo: t.prazo || null,
  prioridade: t.prioridade,
  status: t.status,
  concluida_em: t.concluidaEm || null,
  subtarefas: t.subtarefas || [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialHabitos: HabitoRow[] = HABITOS.map((h) => ({
  id: h.id,
  nome: h.nome,
  icone: h.icone,
  cor: h.cor,
  frequencia: h.frequencia,
  registros: h.registros,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialMetas: MetaRow[] = METAS.map((m) => ({
  id: m.id,
  titulo: m.titulo,
  descricao: m.descricao || null,
  prazo: m.prazo || null,
  progresso: m.progresso,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

const initialSessoes: SessaoFocoRow[] = SESSOES_FOCO.map((s, idx) => ({
  id: s.id || `sf-${idx}`,
  tarefa_id: s.tarefaId || null,
  duracao_min: s.duracaoMin,
  concluida_em: s.concluidaEm,
  created_at: new Date().toISOString(),
}));

export const mockStorage = {
  getPerfil() {
    return {
      id: "mock-user-001",
      nome: "Usuário Demo",
      plano: "gratis" as const,
      tema: "auto",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  getModos(): ModoRow[] {
    return getItem("modos", initialModos);
  },
  createModo(input: { nome: string; cor: string; icone?: string }): ModoRow {
    const list = this.getModos();
    const novo: ModoRow = {
      id: "m-" + Date.now(),
      nome: input.nome,
      cor: input.cor,
      icone: input.icone || "layers",
      arquivado: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [novo, ...list];
    setItem("modos", updated);
    return novo;
  },
  updateModo(id: string, fields: Partial<ModoRow>): void {
    const list = this.getModos().map((m) =>
      m.id === id ? { ...m, ...fields, updated_at: new Date().toISOString() } : m,
    );
    setItem("modos", list);
  },
  deleteModo(id: string): void {
    setItem(
      "modos",
      this.getModos().filter((m) => m.id !== id),
    );
  },

  getTarefas(): TarefaRow[] {
    return getItem("tarefas", initialTarefas);
  },
  createTarefa(input: {
    titulo: string;
    modo_id?: string | null;
    prazo?: string | null;
    prioridade?: "baixa" | "media" | "alta";
    descricao?: string | null;
    status?: string;
  }): TarefaRow {
    const list = this.getTarefas();
    const novo: TarefaRow = {
      id: "t-" + Date.now(),
      titulo: input.titulo,
      modo_id: input.modo_id ?? null,
      prazo: input.prazo ?? null,
      prioridade: input.prioridade ?? "media",
      descricao: input.descricao ?? null,
      status: (input.status as TarefaRow["status"]) ?? "pendente",
      concluida_em: null,
      subtarefas: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem("tarefas", [novo, ...list]);
    return novo;
  },
  updateTarefa(id: string, fields: Partial<TarefaRow>): void {
    const list = this.getTarefas().map((t) =>
      t.id === id ? { ...t, ...fields, updated_at: new Date().toISOString() } : t,
    );
    setItem("tarefas", list);
  },
  deleteTarefa(id: string): void {
    setItem(
      "tarefas",
      this.getTarefas().filter((t) => t.id !== id),
    );
  },

  getHabitos(): HabitoRow[] {
    return getItem("habitos", initialHabitos);
  },
  createHabito(input: { nome: string; cor?: string; icone?: string }): HabitoRow {
    const list = this.getHabitos();
    const novo: HabitoRow = {
      id: "h-" + Date.now(),
      nome: input.nome,
      cor: input.cor ?? "#7c3aed",
      icone: input.icone ?? "heart",
      frequencia: "diario",
      registros: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem("habitos", [...list, novo]);
    return novo;
  },
  updateHabito(id: string, fields: Partial<HabitoRow>): void {
    const list = this.getHabitos().map((h) =>
      h.id === id ? { ...h, ...fields, updated_at: new Date().toISOString() } : h,
    );
    setItem("habitos", list);
  },
  deleteHabito(id: string): void {
    setItem(
      "habitos",
      this.getHabitos().filter((h) => h.id !== id),
    );
  },

  getMetas(): MetaRow[] {
    return getItem("metas", initialMetas);
  },
  createMeta(input: {
    titulo: string;
    prazo?: string | null;
    progresso?: number;
    descricao?: string | null;
  }): MetaRow {
    const list = this.getMetas();
    const novo: MetaRow = {
      id: "mt-" + Date.now(),
      titulo: input.titulo,
      prazo: input.prazo ?? null,
      progresso: input.progresso ?? 0,
      descricao: input.descricao ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setItem("metas", [novo, ...list]);
    return novo;
  },
  updateMeta(id: string, fields: Partial<MetaRow>): void {
    const list = this.getMetas().map((m) =>
      m.id === id ? { ...m, ...fields, updated_at: new Date().toISOString() } : m,
    );
    setItem("metas", list);
  },
  deleteMeta(id: string): void {
    setItem(
      "metas",
      this.getMetas().filter((m) => m.id !== id),
    );
  },

  getSessoesFoco(): SessaoFocoRow[] {
    return getItem("sessoes_foco", initialSessoes);
  },
  createSessaoFoco(input: { duracao_min: number; tarefa_id?: string | null }): SessaoFocoRow {
    const list = this.getSessoesFoco();
    const novo: SessaoFocoRow = {
      id: "sf-" + Date.now(),
      tarefa_id: input.tarefa_id ?? null,
      duracao_min: input.duracao_min,
      concluida_em: new Date().toISOString().split("T")[0],
      created_at: new Date().toISOString(),
    };
    setItem("sessoes_foco", [novo, ...list]);
    return novo;
  },
};
