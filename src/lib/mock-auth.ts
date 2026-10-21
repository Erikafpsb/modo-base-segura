// Autenticação fictícia local — sem banco de dados.
// Substitua este módulo pela integração real quando conectar o banco.

export type MockUser = {
  id: string;
  email: string;
  nome: string;
  user_metadata: { nome: string };
};

// Credencial fixa para acesso de demonstração
const MOCK_EMAIL = "email@email.com";
const MOCK_SENHA = "123456";
const MOCK_USER: MockUser = {
  id: "mock-user-001",
  email: MOCK_EMAIL,
  nome: "Usuário Demo",
  user_metadata: { nome: "Usuário Demo" },
};

const SESSION_KEY = "modo_mock_session";

// ---------------------------------------------------------------------------
// Helpers de sessão (localStorage — client-side apenas)
// ---------------------------------------------------------------------------

function salvarSessao() {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USER));
}

function limparSessao() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function sessaoAtual(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// API mock (mesma "forma" que os componentes esperam)
// ---------------------------------------------------------------------------

export async function signInWithPassword(email: string, password: string): Promise<{ error: string | null }> {
  await delay(400); // simula latência de rede
  if (email.trim().toLowerCase() === MOCK_EMAIL && password === MOCK_SENHA) {
    salvarSessao();
    // dispara evento para __root.tsx invalidar o router
    dispatchAuthEvent("SIGNED_IN");
    return { error: null };
  }
  return { error: "E-mail ou senha incorretos." };
}

export async function signOut(): Promise<void> {
  await delay(200);
  limparSessao();
  dispatchAuthEvent("SIGNED_OUT");
}

export async function getUser(): Promise<{ data: { user: MockUser | null } }> {
  const user = sessaoAtual();
  return { data: { user } };
}

/** Envia link de recuperação (modo demo: apenas simula envio) */
export async function resetPasswordForEmail(_email: string): Promise<{ error: null }> {
  await delay(500);
  return { error: null };
}

/** Redefine senha (modo demo: apenas simula) */
export async function updatePassword(_novaSenha: string): Promise<{ error: null }> {
  await delay(400);
  return { error: null };
}

/** Cadastro (modo demo: apenas simula envio de e-mail de confirmação) */
export async function signUp(_nome: string, _email: string, _senha: string): Promise<{ error: null }> {
  await delay(500);
  return { error: null };
}

// ---------------------------------------------------------------------------
// Evento customizado para reatividade no router
// ---------------------------------------------------------------------------

export type AuthEventType = "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED";

function dispatchAuthEvent(event: AuthEventType) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("modo:auth", { detail: { event } }));
  }
}

export function onAuthStateChange(callback: (event: AuthEventType) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ event: AuthEventType }>).detail;
    callback(detail.event);
  };
  window.addEventListener("modo:auth", handler);
  return () => window.removeEventListener("modo:auth", handler);
}

// ---------------------------------------------------------------------------
// Utilitário
// ---------------------------------------------------------------------------

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
