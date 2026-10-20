# Modo — Parte 1: Base e autenticação

Observação: o projeto ainda não tem nenhum banco conectado (é o modelo inicial, sem páginas próprias). Vou ativar o Lovable Cloud, que é o banco/serviço deste projeto — nenhum serviço externo extra será criado.

## O que será construído
- **Página inicial (/)**: apresentação curta do Modo com botões "Entrar" e "Criar conta".
- **/cadastro**: nome, e-mail e senha. Após cadastrar, aviso "confirme seu e-mail".
- **/entrar**: e-mail e senha, link "Esqueci minha senha".
- **/recuperar-senha**: envia o link de redefinição por e-mail.
- **/redefinir-senha**: define a nova senha a partir do link recebido.
- **/painel (protegido)**: saudação "Olá, {nome}" e cartões reservados ("Em breve") para futuras funcionalidades; botão Sair no topo.
- Sessão mantida ao atualizar; quem não está logado e abre /painel é levado para /entrar.
- Visual moderno, responsivo, em português, com identidade própria (paleta e fontes definidas nos estilos globais).

## Segurança
- Senhas tratadas somente pelo sistema de autenticação (nunca salvas manualmente).
- Tabela de perfis (nome) criada automaticamente no cadastro, com RLS: cada usuário lê e edita apenas o próprio perfil.

## Fora do escopo
IA, tarefas, calendário, Premium, pagamentos, login com Google.

## Detalhes técnicos
- Ativar Lovable Cloud; habilitar login por e-mail/senha.
- Migração: `profiles(id uuid PK -> auth.users ON DELETE CASCADE, nome text, created_at)`, GRANTs para authenticated/service_role, RLS com políticas select/update/insert por `auth.uid() = id`, trigger `handle_new_user` lendo `raw_user_meta_data->>'nome'`.
- Rotas: `src/routes/index.tsx`, `cadastro.tsx`, `entrar.tsx`, `recuperar-senha.tsx`, `redefinir-senha.tsx`, `_authenticated/route.tsx` (gerenciado, ssr:false) e `_authenticated/painel.tsx`.
- `onAuthStateChange` único em `__root.tsx`; Toaster (sonner) montado no root; head() próprio em cada rota.
- Testes: fluxo real via Playwright (cadastro, login, logout, recuperação, redirecionamento do /painel) e teste unitário para a regra de proteção do painel.
