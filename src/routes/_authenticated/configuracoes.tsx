import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Palette,
  User,
  Bell,
  Lock,
  Crown,
  Check,
  Download,
  AlertTriangle,
  Sparkles,
  Info,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { TEMAS, type ThemeId, getStoredTheme, applyTheme } from "@/lib/theme";
import { atualizarPerfil } from "@/lib/supabase-auth";
import { useModos, useTarefas, useHabitos, useMetas } from "@/hooks/use-supabase-data";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações & Temas — Modo" },
      { name: "description", content: "Personalize temas, notificações e preferências da sua conta." },
    ],
  }),
  component: Configuracoes,
});

type Aba = "aparencia" | "perfil" | "notificacoes" | "dados";

function Configuracoes() {
  const { user } = Route.useRouteContext();
  const [abaAtiva, setAbaAtiva] = useState<Aba>("aparencia");
  const [temaAtual, setTemaAtual] = useState<ThemeId>("auto");

  const planoUsuario = user.plano || "gratis";
  const { data: modos = [] } = useModos();
  const { data: tarefas = [] } = useTarefas();
  const { data: habitos = [] } = useHabitos();
  const { data: metas = [] } = useMetas();

  // Perfil state
  const [nome, setNome] = useState(user.nome || "Usuário Modo");
  const [email] = useState(user.email || "");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  // Notificações state
  const [lembreteTarefas, setLembreteTarefas] = useState(true);
  const [somPomodoro, setSomPomodoro] = useState(true);
  const [resumoSemanal, setResumoSemanal] = useState(false);

  useEffect(() => {
    setTemaAtual(getStoredTheme());
  }, []);

  async function handleSelecionarTema(tema: typeof TEMAS[number]) {
    if (tema.premium && planoUsuario === "gratis") {
      toast.info("Tema exclusivo do plano Premium!", {
        description: "Faça o upgrade para desbloquear todos os 6 temas adicionais.",
        action: {
          label: "Ver planos",
          onClick: () => {
            window.location.href = "/planos";
          },
        },
      });
      return;
    }

    applyTheme(tema.id);
    setTemaAtual(tema.id);
    await atualizarPerfil({ tema: tema.id });
    toast.success(`Tema "${tema.nome}" aplicado com sucesso!`);
  }

  async function handleSalvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoPerfil(true);
    const { error } = await atualizarPerfil({ nome });
    setSalvandoPerfil(false);
    if (error) {
      toast.error(`Erro ao atualizar perfil: ${error}`);
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
  }

  function handleExportarDados() {
    const dados = {
      usuario: { nome, email, plano: planoUsuario },
      modos,
      tarefas,
      habitos,
      metas,
      exportadoEm: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `modo-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Dados exportados com sucesso!");
  }

  return (
    <AppLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize a aparência, notificações e preferências da sua conta no Modo.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border pb-3">
        <TabButton
          active={abaAtiva === "aparencia"}
          onClick={() => setAbaAtiva("aparencia")}
          icon={<Palette size={16} />}
          label="Aparência & Temas"
        />
        <TabButton
          active={abaAtiva === "perfil"}
          onClick={() => setAbaAtiva("perfil")}
          icon={<User size={16} />}
          label="Perfil & Conta"
        />
        <TabButton
          active={abaAtiva === "notificacoes"}
          onClick={() => setAbaAtiva("notificacoes")}
          icon={<Bell size={16} />}
          label="Notificações"
        />
        <TabButton
          active={abaAtiva === "dados"}
          onClick={() => setAbaAtiva("dados")}
          icon={<Download size={16} />}
          label="Privacidade & Dados"
        />
      </div>

      {/* Conteúdo das Abas */}
      {abaAtiva === "aparencia" && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Temas do Sistema</h2>
                <p className="text-sm text-muted-foreground">
                  Escolha um tema para personalizar as cores de toda a aplicação. As alterações são aplicadas imediatamente.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground md:mt-0">
                <Sparkles size={14} className="text-primary" />
                <span>Plano atual: <strong className="capitalize">{planoUsuario}</strong></span>
              </div>
            </div>

            {/* Grid de temas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEMAS.map((tema) => {
                const isSelected = temaAtual === tema.id;
                const isBloqueado = tema.premium && planoUsuario === "gratis";

                return (
                  <div
                    key={tema.id}
                    onClick={() => handleSelecionarTema(tema)}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all hover:scale-[1.02] ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 shadow-md"
                        : "border-border hover:border-border/80 hover:shadow-sm"
                    }`}
                  >
                    {/* Badge do tema */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{tema.nome}</span>
                        {tema.premium && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            <Crown size={11} />
                            Premium
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check size={13} />
                        </span>
                      )}
                      {isBloqueado && (
                        <span className="text-muted-foreground" title="Requer plano Premium">
                          <Lock size={14} />
                        </span>
                      )}
                    </div>

                    <p className="mb-4 text-xs text-muted-foreground">{tema.descricao}</p>

                    {/* Pré-visualização visual de cores do cartão */}
                    <div
                      className="rounded-xl border p-3 shadow-inner"
                      style={{ backgroundColor: tema.cores.bg, borderColor: "rgba(0,0,0,0.08)" }}
                    >
                      <div
                        className="rounded-lg p-2.5 shadow-sm"
                        style={{ backgroundColor: tema.cores.card }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: tema.cores.primary }}
                          />
                          <div
                            className="h-2 w-16 rounded-full"
                            style={{ backgroundColor: tema.cores.primary, opacity: 0.8 }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div
                            className="h-2 w-10 rounded-full"
                            style={{ backgroundColor: tema.cores.accent }}
                          />
                          <div
                            className="h-2 w-6 rounded-full"
                            style={{ backgroundColor: tema.cores.accent, opacity: 0.6 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Banner de upgrade de temas */}
          {planoUsuario === "gratis" && (
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <Crown className="mt-1 h-5 w-5 text-primary shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">Desbloqueie todos os temas exclusivos</h3>
                  <p className="text-sm text-muted-foreground">
                    Assine o Modo Premium para usar os temas Lavanda, Oceano, Floresta, Pôr do Sol, Rosa e Grafite.
                  </p>
                </div>
              </div>
              <Button asChild className="shrink-0 rounded-xl">
                <Link to="/planos">Conhecer o Premium</Link>
              </Button>
            </div>
          )}
        </section>
      )}

      {abaAtiva === "perfil" && (
        <section className="space-y-6">
          <form onSubmit={handleSalvarPerfil} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Informações da Conta</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Seus dados pessoais salvos no Modo.
            </p>

            <div className="max-w-md space-y-4">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="mt-1.5 rounded-xl"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="mt-1.5 rounded-xl bg-secondary/50 text-muted-foreground cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  O e-mail é utilizado para login e notificações.
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={salvandoPerfil} className="rounded-xl">
                  {salvandoPerfil ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
          </form>

          {/* Plano atual */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Seu plano: Plano Grátis</h3>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Ativo
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Você tem acesso a até 2 modos, tarefas essenciais, hábitos, calendário e temas padrão.
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-xl">
                <Link to="/planos">Gerenciar plano</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {abaAtiva === "notificacoes" && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Preferências de Notificação</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Controle como e quando você deseja ser lembrado sobre suas tarefas e rotinas.
            </p>

            <div className="space-y-4 max-w-lg">
              <label className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lembreteTarefas}
                  onChange={(e) => {
                    setLembreteTarefas(e.target.checked);
                    toast.success("Preferência de lembrete atualizada!");
                  }}
                  className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-foreground">Lembretes de tarefas do dia</div>
                  <div className="text-xs text-muted-foreground">
                    Receba um alerta visual quando houver tarefas com prazo para hoje ou atrasadas.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={somPomodoro}
                  onChange={(e) => {
                    setSomPomodoro(e.target.checked);
                    toast.success("Sons do foco atualizados!");
                  }}
                  className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-foreground">Alerta sonoro ao encerrar foco</div>
                  <div className="text-xs text-muted-foreground">
                    Tocar um sino sutil quando o temporizador Pomodoro atingir 00:00.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={resumoSemanal}
                  onChange={(e) => {
                    setResumoSemanal(e.target.checked);
                    toast.success("Resumo semanal atualizado!");
                  }}
                  className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
                />
                <div>
                  <div className="font-medium text-foreground">Resumo semanal de produtividade</div>
                  <div className="text-xs text-muted-foreground">
                    Exibir um cartão com o balanço de tarefas e hábitos concluídos no domingo à noite.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </section>
      )}

      {abaAtiva === "dados" && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Exportação e Backup</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Você pode fazer o download de todas as suas tarefas, modos, metas e histórico a qualquer momento.
            </p>
            <Button onClick={handleExportarDados} variant="outline" className="gap-2 rounded-xl">
              <Download size={16} />
              Exportar dados completos em JSON
            </Button>
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Zona de Perigo</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  A exclusão da conta apaga permanentemente todos os modos, tarefas e histórico associados. Esta ação não poderá ser desfeita.
                </p>
                <div className="mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm("Tem certeza de que deseja excluir sua conta? Esta ação é irreversível.")) {
                        toast.info("Para sua segurança, a exclusão de conta em ambiente demonstrativo está desabilitada.");
                      }
                    }}
                    className="rounded-xl"
                  >
                    Excluir minha conta
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
