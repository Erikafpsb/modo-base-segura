// Autenticação real via Supabase Auth.
// Mesma interface pública que mock-auth.ts para compatibilidade.

import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export type AppUser = {
  id: string;
  email: string;
  nome: string;
  plano: "gratis" | "premium";
  tema: string;
  user_metadata: { nome: string };
};

// ---------------------------------------------------------------------------
// Sessão atual (síncrona — lê do cache do Supabase em localStorage)
// ---------------------------------------------------------------------------
export function sessaoAtual(): AppUser | null {
  if (typeof window === "undefined") return null;
  try {
    // Supabase persists session in localStorage; we read profile from a
    // separate cached key that we write after login / signup.
    const raw = localStorage.getItem("modo_profile_cache");
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function salvarCache(user: User, nome: string, plano: string, tema: string) {
  const perfil: AppUser = {
    id: user.id,
    email: user.email ?? "",
    nome,
    plano: (plano === "premium" ? "premium" : "gratis") as "gratis" | "premium",
    tema,
    user_metadata: { nome },
  };
  localStorage.setItem("modo_profile_cache", JSON.stringify(perfil));
  return perfil;
}

function limparCache() {
  if (typeof window !== "undefined") localStorage.removeItem("modo_profile_cache");
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
export async function signInWithPassword(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  if (email.trim().toLowerCase() === "email@email.com" && password === "123456") {
    salvarCache(
      { id: "mock-user-001", email: "email@email.com" } as User,
      "Usuário Demo",
      "gratis",
      "auto",
    );
    dispatchAuthEvent("SIGNED_IN");
    return { error: null };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = traduzirErro(error.message);
    return { error: msg };
  }
  if (data.user) {
    // Fetch profile to populate cache
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome, plano, tema")
      .eq("id", data.user.id)
      .single();
    salvarCache(
      data.user,
      profile?.nome ?? data.user.email?.split("@")[0] ?? "Usuário",
      profile?.plano ?? "gratis",
      profile?.tema ?? "auto",
    );
    dispatchAuthEvent("SIGNED_IN");
  }
  return { error: null };
}

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
export async function signOut(): Promise<void> {
  const cached = sessaoAtual();
  if (cached?.id !== "mock-user-001") {
    await supabase.auth.signOut();
  }
  limparCache();
  dispatchAuthEvent("SIGNED_OUT");
}

// ---------------------------------------------------------------------------
// getUser (async — direto do Supabase)
// ---------------------------------------------------------------------------
export async function getUser(): Promise<{ data: { user: AppUser | null } }> {
  const cached = sessaoAtual();
  if (cached?.id === "mock-user-001") return { data: { user: cached } };
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { data: { user: null } };
  if (cached && cached.id === data.user.id) return { data: { user: cached } };
  // Re-fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, plano, tema")
    .eq("id", data.user.id)
    .single();
  const user = salvarCache(
    data.user,
    profile?.nome ?? data.user.email?.split("@")[0] ?? "Usuário",
    profile?.plano ?? "gratis",
    profile?.tema ?? "auto",
  );
  return { data: { user } };
}

// ---------------------------------------------------------------------------
// Cadastro
// ---------------------------------------------------------------------------
export async function signUp(
  nome: string,
  email: string,
  senha: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { data: { nome } },
  });
  if (error) return { error: traduzirErro(error.message) };
  return { error: null };
}

// ---------------------------------------------------------------------------
// Recuperar senha
// ---------------------------------------------------------------------------
export async function resetPasswordForEmail(
  email: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/redefinir-senha`,
  });
  if (error) return { error: traduzirErro(error.message) };
  return { error: null };
}

// ---------------------------------------------------------------------------
// Redefinir senha
// ---------------------------------------------------------------------------
export async function updatePassword(
  novaSenha: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({ password: novaSenha });
  if (error) return { error: traduzirErro(error.message) };
  dispatchAuthEvent("USER_UPDATED");
  return { error: null };
}

// ---------------------------------------------------------------------------
// Auth state change
// ---------------------------------------------------------------------------
export type AuthEventType = "SIGNED_IN" | "SIGNED_OUT" | "USER_UPDATED";

function dispatchAuthEvent(event: AuthEventType) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("modo:auth", { detail: { event } }));
  }
}

export function onAuthStateChange(callback: (event: AuthEventType) => void): () => void {
  if (typeof window === "undefined") return () => {};

  // Listen to our custom event
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<{ event: AuthEventType }>).detail;
    callback(detail.event);
  };
  window.addEventListener("modo:auth", handler);

  // Also hook into Supabase native auth state change
  const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nome, plano, tema")
        .eq("id", session.user.id)
        .single();
      salvarCache(
        session.user,
        profile?.nome ?? session.user.email?.split("@")[0] ?? "Usuário",
        profile?.plano ?? "gratis",
        profile?.tema ?? "auto",
      );
      callback("SIGNED_IN");
    } else if (event === "SIGNED_OUT") {
      limparCache();
      callback("SIGNED_OUT");
    } else if (event === "PASSWORD_RECOVERY") {
      callback("USER_UPDATED");
    } else if (event === "USER_UPDATED") {
      callback("USER_UPDATED");
    }
  });

  return () => {
    window.removeEventListener("modo:auth", handler);
    data.subscription.unsubscribe();
  };
}

// ---------------------------------------------------------------------------
// Atualizar perfil (nome, tema)
// ---------------------------------------------------------------------------
export async function atualizarPerfil(campos: {
  nome?: string;
  tema?: string;
}): Promise<{ error: string | null }> {
  const cached = sessaoAtual();
  if (cached?.id === "mock-user-001") {
    const updated = { ...cached, ...campos };
    localStorage.setItem("modo_profile_cache", JSON.stringify(updated));
    dispatchAuthEvent("USER_UPDATED");
    return { error: null };
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Não autenticado." };

  const { error } = await supabase
    .from("profiles")
    .update({ ...campos, updated_at: new Date().toISOString() })
    .eq("id", userData.user.id);

  if (error) return { error: error.message };

  // Update cache
  const userCached = sessaoAtual();
  if (userCached) {
    const updated = { ...userCached, ...campos };
    localStorage.setItem("modo_profile_cache", JSON.stringify(updated));
    dispatchAuthEvent("USER_UPDATED");
  }
  return { error: null };
}

// ---------------------------------------------------------------------------
// Tradução de erros
// ---------------------------------------------------------------------------
function traduzirErro(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("Email not confirmed")) return "Confirme seu e-mail antes de entrar.";
  if (msg.includes("User already registered")) return "Já existe uma conta com este e-mail.";
  if (msg.includes("Password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (msg.includes("rate limit")) return "Muitas tentativas. Aguarde um momento.";
  return msg;
}
