# PRD — Modo

**Produto:** Modo — organização pessoal e produtividade  
**Versão:** 1.0  
**Idioma inicial:** Português brasileiro (pt-BR)  
**Plataforma:** Aplicação web responsiva  
**Diretriz principal:** construir uma primeira versão bonita, útil e simples de manter, economizando créditos de desenvolvimento.

## 1. Visão do produto

O Modo é um site onde cada pessoa pode organizar tarefas, estudos, trabalho, hábitos e metas em espaços chamados **Modos**. O produto terá cadastro e login reais, dados salvos na conta, um plano gratuito e um plano Premium.

**Não utilizar inteligência artificial em nenhuma parte do produto.** Não criar pagamentos reais nesta primeira etapa.

## 2. Objetivos

- Ajudar usuários a organizar a rotina em um único lugar.
- Tornar simples criar, acompanhar e concluir tarefas.
- Permitir personalizar a aparência com temas bonitos e acessíveis.
- Oferecer uma versão gratuita útil e recursos avançados no Premium.
- Manter a implementação leve, sem serviços ou bancos de dados duplicados.

## 3. Público-alvo

Estudantes, trabalhadores e pessoas que desejam organizar tarefas, hábitos, metas e compromissos sem precisar usar várias ferramentas diferentes.

## 4. Diretrizes de implementação

- Reutilizar o projeto, componentes, estilos e configurações que já existirem.
- Usar **um único projeto Supabase** para autenticação e banco PostgreSQL.
- Criar apenas estruturas de dados necessárias; não adicionar outro provedor de banco de dados.
- Priorizar o funcionamento real antes de adicionar animações ou detalhes decorativos.
- Não reconstruir telas já implementadas sem necessidade.
- Nenhuma funcionalidade de IA.
- Não ativar cobranças nem simular pagamentos. A tela de Premium deve informar que a contratação será disponibilizada futuramente, até a integração de pagamentos ser configurada.

## 5. Experiência e navegação

O site deve ter páginas para:
- Cadastro e login.
- Recuperação de senha.
- Painel principal.
- Modos.
- Tarefas.
- Calendário.
- Hábitos e metas.
- Temporizador de foco.
- Estatísticas.
- Temas e configurações.
- Planos Grátis e Premium.

No computador, usar menu lateral. No celular, usar navegação compacta e adaptada à tela. Manter títulos claros, botões consistentes, estados de carregamento, mensagens de erro e telas vazias úteis.

## 6. Requisitos funcionais

### 6.1 Cadastro, login e conta

Implementar autenticação real com Supabase Auth:
- Cadastro com nome, e-mail e senha.
- Login com e-mail e senha.
- Link para recuperação de senha.
- Logout.
- Sessão persistente ao atualizar ou reabrir o site.
- Proteção das páginas privadas.
- Mensagens de erro e sucesso em português.

Manter o fluxo simples: **não incluir login com Google nesta versão**. Não armazenar senhas manualmente. Após o login, abrir o painel da conta. Cada usuário só pode visualizar e alterar seus próprios dados.

### 6.2 Painel principal

Exibir saudação, data, tarefas do dia, pendências, tarefas concluídas, progresso diário e atalhos para criar tarefas ou modos. Quando ainda não houver dados, mostrar uma orientação simples para começar.

### 6.3 Modos

Permitir criar, editar, renomear, personalizar cor e ícone, arquivar e excluir modos com confirmação. Exemplos: Estudos, Trabalho, Pessoal, Academia e Projetos. Cada modo reúne suas tarefas e mostra um resumo básico de progresso.

### 6.4 Tarefas

Cada tarefa deve ter título, descrição opcional, modo, prazo, prioridade, status e data de conclusão. Permitir criar, editar, concluir, excluir, pesquisar, filtrar e ordenar tarefas. Destacar tarefas atrasadas. Incluir subtarefas quando possível sem complicar a primeira versão.

### 6.5 Calendário

Criar visualizações mensal e semanal para mostrar tarefas e prazos. Permitir avançar e voltar entre períodos e abrir uma tarefa a partir do calendário. O calendário deve usar dados reais de tarefas, sem criar um sistema separado de compromissos nesta versão.

### 6.6 Hábitos e metas

Permitir cadastrar hábitos e marcar o cumprimento por dia. Permitir criar metas com título, prazo e progresso. Mostrar o histórico simples e a evolução a partir dos registros reais do usuário.

### 6.7 Temporizador de foco

Criar um Pomodoro simples com iniciar, pausar, continuar e reiniciar. Permitir configurar a duração da sessão e das pausas. Registrar sessões concluídas e o tempo de foco associado a uma tarefa, quando selecionada.

### 6.8 Estatísticas

Mostrar resumo de tarefas concluídas, pendências, hábitos registrados e tempo de foco. No plano gratuito, exibir indicadores básicos. Reservar filtros e histórico ampliados para o Premium. Nunca usar números fictícios como se fossem dados reais.

## 7. Temas e design visual

### 7.1 Requisitos do seletor de temas

Criar uma área **Aparência** nas configurações com cartões de pré-visualização. Ao selecionar um tema, aplicar imediatamente as cores no site e salvar a preferência na conta. Incluir a opção **Automático**, que acompanha a preferência de tema do dispositivo.

O tema deve afetar de forma consistente o fundo, menu, cartões, botões, bordas, textos, campos, gráficos, estados selecionados e janelas. Usar variáveis de tema/design tokens para que as páginas não precisem ser redesenhadas individualmente.

### 7.2 Temas sugeridos

**Disponíveis no plano gratuito:**
- **Claro:** fundo branco, superfícies cinza muito claro e destaque roxo.
- **Escuro:** fundo azul-preto, cartões escuros e destaque lilás, evitando preto absoluto.
- **Automático:** segue a configuração do sistema operacional.

**Temas adicionais do Premium:**
- **Lavanda:** fundo lilás suave com destaque violeta.
- **Oceano:** tons de azul e ciano, com bom contraste.
- **Floresta:** tons naturais de verde e superfícies claras ou escuras coordenadas.
- **Pôr do Sol:** tons quentes de pêssego, coral e laranja suave.
- **Rosa:** rosa suave com detalhes em fúcsia moderado.
- **Grafite:** tons neutros, cinza e destaque roxo discreto.

As paletas exatas podem ser ajustadas durante o design, mas todos os temas precisam manter boa legibilidade e consistência. Evitar cores excessivamente saturadas, gradientes em todos os elementos e animações pesadas.

### 7.3 Personalização adicional

- Cores de destaque coordenadas com o tema.
- Cards com cantos arredondados e sombras discretas.
- Ícones simples e consistentes.
- Tipografia legível e espaçamento confortável.
- Transições curtas entre temas, sem animações pesadas.
- Pré-visualização do tema antes de escolhê-lo.
- No Premium, liberar os temas adicionais; o seletor não deve quebrar nem esconder o conteúdo se um tema estiver bloqueado.
- Usar contraste acessível em botões, links, textos e campos. Não comunicar status apenas pela cor.

## 8. Planos

### Grátis — R$ 0
- Até 2 modos.
- Até 10 tarefas por modo.
- Recursos básicos de tarefas.
- Calendário básico.
- Hábitos e metas básicos.
- Pomodoro básico.
- Estatísticas resumidas.
- Temas Claro, Escuro e Automático.

### Premium — preço sugerido de R$ 9,90 por mês ou R$ 79,90 por ano
- Modos e tarefas ilimitados.
- Histórico e estatísticas ampliadas.
- Opções avançadas de calendário, metas e foco.
- Relatórios exportáveis, se implementados nesta versão.
- Temas Lavanda, Oceano, Floresta, Pôr do Sol, Rosa e Grafite.

Os valores são sugestões configuráveis, não preços validados. Nesta versão, apresentar os planos e seus benefícios, mas não processar pagamentos. Não permitir que o usuário altere o próprio plano para Premium pelo navegador.

## 9. Dados e segurança

Usar somente o projeto Supabase existente, se já estiver conectado. Reutilizar tabelas existentes e criar apenas as necessárias para perfis/preferências, modos, tarefas, hábitos, metas e sessões de foco. Não é necessário criar tabelas para calendários ou temas separados se esses dados puderem ser derivados ou guardados nas preferências do perfil.

- Associar os registros ao usuário proprietário.
- Ativar Row Level Security (RLS) nas tabelas com dados privados.
- Permitir acesso apenas aos registros autorizados do próprio usuário.
- Guardar a preferência de tema na conta para restaurá-la em outros acessos.
- Não expor chaves secretas no frontend.
- O plano do usuário não pode ser alterado livremente pelo próprio usuário.
- Confirmar antes de excluir modos, tarefas ou conta.

## 10. Requisitos não funcionais

- Layout responsivo para computador, tablet e celular.
- Carregamento rápido e poucas dependências desnecessárias.
- Acessibilidade básica: contraste adequado, foco visível e navegação por teclado.
- Mensagens e interface em português brasileiro.
- Tratamento de erros de conexão e salvamento.
- Persistência real dos dados entre sessões.
- Nenhum botão apresentado como funcional sem ação implementada.

## 11. Critérios de aceitação

O produto será considerado pronto para testes quando:
1. Uma pessoa conseguir cadastrar uma conta, entrar, sair e recuperar a senha.
2. O painel privado exigir login.
3. Duas contas diferentes não conseguirem acessar os dados uma da outra.
4. Modos e tarefas puderem ser criados, editados, concluídos e excluídos, com os dados salvos.
5. O calendário mostrar os prazos reais das tarefas.
6. Hábitos, metas e sessões de foco registrarem os dados do usuário.
7. As preferências de tema forem aplicadas em todas as páginas e permanecerem salvas após novo login.
8. Os limites do plano gratuito forem respeitados.
9. O Premium apresentar claramente seus recursos, sem simular pagamentos.
10. O site funcionar adequadamente em telas pequenas e grandes.

## 12. Ordem de implementação

**Fase 1 — Base:** reutilizar o projeto atual, configurar Supabase Auth, proteger o painel e garantir persistência.

**Fase 2 — Núcleo:** modos, tarefas, painel e calendário básico.

**Fase 3 — Aparência:** implementar o sistema de temas com variáveis compartilhadas e salvar a preferência do usuário.

**Fase 4 — Complementos:** hábitos, metas, Pomodoro e estatísticas.

**Fase 5 — Planos e revisão:** limites de uso, comparação de planos, testes de segurança, responsividade e correções.

Implementar uma fase por vez, testar antes de avançar e evitar alterações fora do escopo. O resultado deve ser uma primeira versão funcional, visualmente atraente e simples de manter, sem inteligência artificial e usando um único projeto Supabase.
