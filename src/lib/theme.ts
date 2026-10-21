// ---------------------------------------------------------------------------
// Gerenciamento de Temas do Modo
// Suporta temas gratuitos (Claro, Escuro, Automático) e Premium
// ---------------------------------------------------------------------------

export type ThemeId =
  | "auto"
  | "claro"
  | "escuro"
  | "lavanda"
  | "oceano"
  | "floresta"
  | "por-do-sol"
  | "rosa"
  | "grafite";

export interface ThemeConfig {
  id: ThemeId;
  nome: string;
  descricao: string;
  premium: boolean;
  cores: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
  };
}

export const TEMAS: ThemeConfig[] = [
  {
    id: "auto",
    nome: "Automático",
    descricao: "Segue a preferência do seu sistema operacional",
    premium: false,
    cores: {
      bg: "#f8fafc",
      card: "#ffffff",
      primary: "#24503f",
      accent: "#d97706",
    },
  },
  {
    id: "claro",
    nome: "Claro",
    descricao: "Fundo suave, superfícies límpidas e destaque elegante",
    premium: false,
    cores: {
      bg: "#f9f9f7",
      card: "#ffffff",
      primary: "#234e40",
      accent: "#e07a5f",
    },
  },
  {
    id: "escuro",
    nome: "Escuro",
    descricao: "Fundo azul-noite profundo com destaque lilás suave",
    premium: false,
    cores: {
      bg: "#0f172a",
      card: "#1e293b",
      primary: "#818cf8",
      accent: "#a78bfa",
    },
  },
  {
    id: "lavanda",
    nome: "Lavanda",
    descricao: "Fundo lilás suave com destaque violeta calmante",
    premium: true,
    cores: {
      bg: "#f5f3ff",
      card: "#ffffff",
      primary: "#7c3aed",
      accent: "#a855f7",
    },
  },
  {
    id: "oceano",
    nome: "Oceano",
    descricao: "Tons marinhos de azul e ciano com alto contraste",
    premium: true,
    cores: {
      bg: "#0c1f2e",
      card: "#132f45",
      primary: "#06b6d4",
      accent: "#38bdf8",
    },
  },
  {
    id: "floresta",
    nome: "Floresta",
    descricao: "Tons naturais de verde botânico e harmonia orgânica",
    premium: true,
    cores: {
      bg: "#f2f7f4",
      card: "#ffffff",
      primary: "#059669",
      accent: "#10b981",
    },
  },
  {
    id: "por-do-sol",
    nome: "Pôr do Sol",
    descricao: "Tons quentes e acolhedores de pêssego, coral e terracota",
    premium: true,
    cores: {
      bg: "#fff7ed",
      card: "#ffffff",
      primary: "#ea580c",
      accent: "#f97316",
    },
  },
  {
    id: "rosa",
    nome: "Rosa",
    descricao: "Rosa suave delicado com toques de fúcsia equilibrado",
    premium: true,
    cores: {
      bg: "#fdf2f8",
      card: "#ffffff",
      primary: "#db2777",
      accent: "#f472b6",
    },
  },
  {
    id: "grafite",
    nome: "Grafite",
    descricao: "Tons neutros sofisticados de ardósia e destaque refinado",
    premium: true,
    cores: {
      bg: "#18181b",
      card: "#27272a",
      primary: "#a1a1aa",
      accent: "#818cf8",
    },
  },
];

const THEME_STORAGE_KEY = "modo_theme_preference";

export function getStoredTheme(): ThemeId {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId | null;
  if (stored && TEMAS.some((t) => t.id === stored)) {
    return stored;
  }
  return "auto";
}

export function applyTheme(theme: ThemeId): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(THEME_STORAGE_KEY, theme);
  const root = document.documentElement;

  // Remove existing data-theme and dark class
  root.removeAttribute("data-theme");
  root.classList.remove("dark");

  if (theme === "auto") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (isDark) {
      root.classList.add("dark");
      root.setAttribute("data-theme", "escuro");
    } else {
      root.setAttribute("data-theme", "claro");
    }
  } else if (theme === "escuro") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "escuro");
  } else {
    // Para temas escuros específicos como grafite ou oceano, também marcamos dark
    if (theme === "oceano" || theme === "grafite") {
      root.classList.add("dark");
    }
    root.setAttribute("data-theme", theme);
  }

  // Notifica componentes
  window.dispatchEvent(new CustomEvent("modo-theme-change", { detail: { theme } }));
}

export function initTheme(): void {
  if (typeof window === "undefined") return;
  const theme = getStoredTheme();
  applyTheme(theme);

  // Monitora alterações na preferência do sistema caso esteja em auto
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", () => {
    if (getStoredTheme() === "auto") {
      applyTheme("auto");
    }
  });
}
