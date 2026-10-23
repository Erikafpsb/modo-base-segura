// Hooks para buscar e mutacionar dados do Supabase (com suporte ao usuário demo local)
// Usando TanStack Query (@tanstack/react-query)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { sessaoAtual } from "@/lib/supabase-auth";
import { mockStorage } from "@/lib/mock-storage";

// ---------------------------------------------------------------------------
// PERFIL
// ---------------------------------------------------------------------------
export function usePerfil() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["perfil", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getPerfil() as any;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId!)
        .single();
      if (error) throw error;
      return data;
    },
  });
}

// ---------------------------------------------------------------------------
// MODOS
// ---------------------------------------------------------------------------
export type ModoRow = {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  arquivado: boolean;
  created_at: string;
  updated_at: string;
};

export function useModos() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["modos", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getModos();
      }
      const { data, error } = await supabase
        .from("modos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as ModoRow[]) ?? [];
    },
  });
}

export function useCreateModo() {
  const qc = useQueryClient();
  const userId = sessaoAtual()?.id;
  return useMutation({
    mutationFn: async (input: { nome: string; cor: string; icone?: string }) => {
      if (userId === "mock-user-001") {
        return mockStorage.createModo(input);
      }
      const { data, error } = await supabase
        .from("modos")
        .insert({ ...input, user_id: userId, icone: input.icone ?? "star" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modos"] }),
  });
}

export function useUpdateModo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<ModoRow> & { id: string }) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.updateModo(id, fields);
        return;
      }
      const { error } = await supabase
        .from("modos")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modos"] }),
  });
}

export function useDeleteModo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.deleteModo(id);
        return;
      }
      const { error } = await supabase.from("modos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["modos"] });
      qc.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });
}

// ---------------------------------------------------------------------------
// TAREFAS
// ---------------------------------------------------------------------------
export type TarefaRow = {
  id: string;
  modo_id: string | null;
  titulo: string;
  descricao: string | null;
  prazo: string | null;
  prioridade: "baixa" | "media" | "alta";
  status: "pendente" | "em_progresso" | "concluida" | "atrasada";
  concluida_em: string | null;
  subtarefas: Array<{ id: string; titulo: string; concluida: boolean }>;
  created_at: string;
  updated_at: string;
};

export function useTarefas() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["tarefas", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getTarefas();
      }
      const { data, error } = await supabase
        .from("tarefas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as TarefaRow[]) ?? [];
    },
  });
}

export function useCreateTarefa() {
  const qc = useQueryClient();
  const userId = sessaoAtual()?.id;
  return useMutation({
    mutationFn: async (input: {
      titulo: string;
      modo_id?: string | null;
      prazo?: string | null;
      prioridade?: "baixa" | "media" | "alta";
      descricao?: string | null;
      status?: string;
    }) => {
      if (userId === "mock-user-001") {
        return mockStorage.createTarefa(input);
      }
      const { data, error } = await supabase
        .from("tarefas")
        .insert({
          titulo: input.titulo,
          modo_id: input.modo_id ?? null,
          prazo: input.prazo ?? null,
          prioridade: input.prioridade ?? "media",
          descricao: input.descricao ?? null,
          status: input.status ?? "pendente",
          user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

export function useUpdateTarefa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<TarefaRow> & { id: string }) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.updateTarefa(id, fields);
        return;
      }
      const { error } = await supabase
        .from("tarefas")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

export function useDeleteTarefa() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.deleteTarefa(id);
        return;
      }
      const { error } = await supabase.from("tarefas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

// ---------------------------------------------------------------------------
// HÁBITOS
// ---------------------------------------------------------------------------
export type HabitoRow = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  frequencia: "diario" | "semanal";
  registros: string[];
  created_at: string;
  updated_at: string;
};

export function useHabitos() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["habitos", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getHabitos();
      }
      const { data, error } = await supabase
        .from("habitos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as HabitoRow[]) ?? [];
    },
  });
}

export function useCreateHabito() {
  const qc = useQueryClient();
  const userId = sessaoAtual()?.id;
  return useMutation({
    mutationFn: async (input: { nome: string; cor?: string; icone?: string }) => {
      if (userId === "mock-user-001") {
        return mockStorage.createHabito(input);
      }
      const { data, error } = await supabase
        .from("habitos")
        .insert({
          nome: input.nome,
          cor: input.cor ?? "#7c3aed",
          icone: input.icone ?? "heart",
          user_id: userId,
          frequencia: "diario",
          registros: [],
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitos"] }),
  });
}

export function useUpdateHabito() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<HabitoRow> & { id: string }) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.updateHabito(id, fields);
        return;
      }
      const { error } = await supabase
        .from("habitos")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitos"] }),
  });
}

export function useDeleteHabito() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.deleteHabito(id);
        return;
      }
      const { error } = await supabase.from("habitos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["habitos"] }),
  });
}

// ---------------------------------------------------------------------------
// METAS
// ---------------------------------------------------------------------------
export type MetaRow = {
  id: string;
  titulo: string;
  descricao: string | null;
  prazo: string | null;
  progresso: number;
  created_at: string;
  updated_at: string;
};

export function useMetas() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["metas", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getMetas();
      }
      const { data, error } = await supabase
        .from("metas")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as MetaRow[]) ?? [];
    },
  });
}

export function useCreateMeta() {
  const qc = useQueryClient();
  const userId = sessaoAtual()?.id;
  return useMutation({
    mutationFn: async (input: {
      titulo: string;
      prazo?: string | null;
      progresso?: number;
      descricao?: string | null;
    }) => {
      if (userId === "mock-user-001") {
        return mockStorage.createMeta(input);
      }
      const { data, error } = await supabase
        .from("metas")
        .insert({
          titulo: input.titulo,
          prazo: input.prazo ?? null,
          progresso: input.progresso ?? 0,
          descricao: input.descricao ?? null,
          user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["metas"] }),
  });
}

export function useUpdateMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: Partial<MetaRow> & { id: string }) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.updateMeta(id, fields);
        return;
      }
      const { error } = await supabase
        .from("metas")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["metas"] }),
  });
}

export function useDeleteMeta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (sessaoAtual()?.id === "mock-user-001") {
        mockStorage.deleteMeta(id);
        return;
      }
      const { error } = await supabase.from("metas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["metas"] }),
  });
}

// ---------------------------------------------------------------------------
// SESSÕES DE FOCO
// ---------------------------------------------------------------------------
export type SessaoFocoRow = {
  id: string;
  tarefa_id: string | null;
  duracao_min: number;
  concluida_em: string;
  created_at: string;
};

export function useSessoesFoco() {
  const userId = sessaoAtual()?.id;
  return useQuery({
    queryKey: ["sessoes_foco", userId],
    enabled: !!userId,
    queryFn: async () => {
      if (userId === "mock-user-001") {
        return mockStorage.getSessoesFoco();
      }
      const { data, error } = await supabase
        .from("sessoes_foco")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as SessaoFocoRow[]) ?? [];
    },
  });
}

export function useCreateSessaoFoco() {
  const qc = useQueryClient();
  const userId = sessaoAtual()?.id;
  return useMutation({
    mutationFn: async (input: { duracao_min: number; tarefa_id?: string | null }) => {
      if (userId === "mock-user-001") {
        return mockStorage.createSessaoFoco(input);
      }
      const { data, error } = await supabase
        .from("sessoes_foco")
        .insert({
          duracao_min: input.duracao_min,
          tarefa_id: input.tarefa_id ?? null,
          concluida_em: new Date().toISOString().split("T")[0],
          user_id: userId,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessoes_foco"] }),
  });
}
