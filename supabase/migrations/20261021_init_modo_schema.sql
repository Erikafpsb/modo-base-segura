-- ============================================================================
-- MODO — Schema Completo do Banco de Dados Supabase (PostgreSQL)
-- ============================================================================

-- 1. TABELA PROFILES (Perfis de Usuários)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  tema text NOT NULL DEFAULT 'auto',
  plano text NOT NULL DEFAULT 'gratis' CHECK (plano IN ('gratis', 'premium')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário visualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário visualiza seu próprio perfil" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuário insere seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário insere seu próprio perfil" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuário atualiza seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário atualiza seu próprio perfil" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;


-- 2. TABELA MODOS (Espaços organizacionais: Trabalho, Estudos, Pessoal...)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.modos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  cor text NOT NULL DEFAULT '#7c3aed',
  icone text NOT NULL DEFAULT 'layers',
  arquivado boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.modos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário gerencia seus próprios modos (SELECT)" ON public.modos;
CREATE POLICY "Usuário gerencia seus próprios modos (SELECT)" ON public.modos
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios modos (INSERT)" ON public.modos;
CREATE POLICY "Usuário gerencia seus próprios modos (INSERT)" ON public.modos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios modos (UPDATE)" ON public.modos;
CREATE POLICY "Usuário gerencia seus próprios modos (UPDATE)" ON public.modos
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios modos (DELETE)" ON public.modos;
CREATE POLICY "Usuário gerencia seus próprios modos (DELETE)" ON public.modos
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_modos_user_id ON public.modos(user_id);
GRANT ALL ON public.modos TO authenticated;
GRANT ALL ON public.modos TO service_role;


-- 3. TABELA TAREFAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tarefas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  modo_id uuid REFERENCES public.modos(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  prazo date,
  prioridade text NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida', 'atrasada')),
  concluida_em timestamptz,
  subtarefas jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário gerencia suas próprias tarefas (SELECT)" ON public.tarefas;
CREATE POLICY "Usuário gerencia suas próprias tarefas (SELECT)" ON public.tarefas
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias tarefas (INSERT)" ON public.tarefas;
CREATE POLICY "Usuário gerencia suas próprias tarefas (INSERT)" ON public.tarefas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias tarefas (UPDATE)" ON public.tarefas;
CREATE POLICY "Usuário gerencia suas próprias tarefas (UPDATE)" ON public.tarefas
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias tarefas (DELETE)" ON public.tarefas;
CREATE POLICY "Usuário gerencia suas próprias tarefas (DELETE)" ON public.tarefas
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tarefas_user_id ON public.tarefas(user_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_modo_id ON public.tarefas(modo_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_prazo ON public.tarefas(prazo);
GRANT ALL ON public.tarefas TO authenticated;
GRANT ALL ON public.tarefas TO service_role;


-- 4. TABELA HÁBITOS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habitos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  icone text NOT NULL DEFAULT 'check',
  cor text NOT NULL DEFAULT '#0891b2',
  frequencia text NOT NULL DEFAULT 'diario' CHECK (frequencia IN ('diario', 'semanal')),
  registros jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.habitos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário gerencia seus próprios hábitos (SELECT)" ON public.habitos;
CREATE POLICY "Usuário gerencia seus próprios hábitos (SELECT)" ON public.habitos
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios hábitos (INSERT)" ON public.habitos;
CREATE POLICY "Usuário gerencia seus próprios hábitos (INSERT)" ON public.habitos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios hábitos (UPDATE)" ON public.habitos;
CREATE POLICY "Usuário gerencia seus próprios hábitos (UPDATE)" ON public.habitos
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia seus próprios hábitos (DELETE)" ON public.habitos;
CREATE POLICY "Usuário gerencia seus próprios hábitos (DELETE)" ON public.habitos
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_habitos_user_id ON public.habitos(user_id);
GRANT ALL ON public.habitos TO authenticated;
GRANT ALL ON public.habitos TO service_role;


-- 5. TABELA METAS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  descricao text,
  prazo date,
  progresso integer NOT NULL DEFAULT 0 CHECK (progresso >= 0 AND progresso <= 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário gerencia suas próprias metas (SELECT)" ON public.metas;
CREATE POLICY "Usuário gerencia suas próprias metas (SELECT)" ON public.metas
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias metas (INSERT)" ON public.metas;
CREATE POLICY "Usuário gerencia suas próprias metas (INSERT)" ON public.metas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias metas (UPDATE)" ON public.metas;
CREATE POLICY "Usuário gerencia suas próprias metas (UPDATE)" ON public.metas
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias metas (DELETE)" ON public.metas;
CREATE POLICY "Usuário gerencia suas próprias metas (DELETE)" ON public.metas
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_metas_user_id ON public.metas(user_id);
GRANT ALL ON public.metas TO authenticated;
GRANT ALL ON public.metas TO service_role;


-- 6. TABELA SESSÕES DE FOCO (Pomodoro)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sessoes_foco (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tarefa_id uuid REFERENCES public.tarefas(id) ON DELETE SET NULL,
  duracao_min integer NOT NULL DEFAULT 25,
  concluida_em date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sessoes_foco ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário gerencia suas próprias sessões (SELECT)" ON public.sessoes_foco;
CREATE POLICY "Usuário gerencia suas próprias sessões (SELECT)" ON public.sessoes_foco
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias sessões (INSERT)" ON public.sessoes_foco;
CREATE POLICY "Usuário gerencia suas próprias sessões (INSERT)" ON public.sessoes_foco
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuário gerencia suas próprias sessões (DELETE)" ON public.sessoes_foco;
CREATE POLICY "Usuário gerencia suas próprias sessões (DELETE)" ON public.sessoes_foco
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessoes_foco_user_id ON public.sessoes_foco(user_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_foco_data ON public.sessoes_foco(concluida_em);
GRANT ALL ON public.sessoes_foco TO authenticated;
GRANT ALL ON public.sessoes_foco TO service_role;


-- 7. TRIGGER: CRIAÇÃO AUTOMÁTICA DE PERFIL E DADOS INICIAIS NO CADASTRO
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_modo_trabalho_id uuid;
  v_modo_estudos_id uuid;
BEGIN
  -- 1. Cria o perfil
  INSERT INTO public.profiles (id, nome, tema, plano)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    'auto',
    'gratis'
  );

  -- 2. Cria modos padrão de boas-vindas
  INSERT INTO public.modos (user_id, nome, cor, icone)
  VALUES (NEW.id, 'Trabalho', '#7c3aed', 'briefcase')
  RETURNING id INTO v_modo_trabalho_id;

  INSERT INTO public.modos (user_id, nome, cor, icone)
  VALUES (NEW.id, 'Estudos', '#0891b2', 'book-open')
  RETURNING id INTO v_modo_estudos_id;

  -- 3. Cria tarefas de boas-vindas
  INSERT INTO public.tarefas (user_id, modo_id, titulo, descricao, prazo, prioridade, status, subtarefas)
  VALUES (
    NEW.id,
    v_modo_trabalho_id,
    'Explorar os recursos do Modo',
    'Conheça o painel, crie seus modos e configure seu primeiro foco.',
    CURRENT_DATE,
    'alta',
    'em_progresso',
    '[{"id": "sub-1", "titulo": "Personalizar aparência em Configurações", "concluida": false}, {"id": "sub-2", "titulo": "Experimentar o Pomodoro", "concluida": false}]'::jsonb
  );

  -- 4. Cria hábitos essenciais sugeridos
  INSERT INTO public.habitos (user_id, nome, icone, cor, frequencia, registros)
  VALUES
    (NEW.id, 'Beber 2L de água', 'droplets', '#0891b2', 'diario', jsonb_build_array(to_char(CURRENT_DATE, 'YYYY-MM-DD'))),
    (NEW.id, 'Pausa para alongar', 'heart', '#7c3aed', 'diario', '[]'::jsonb);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
