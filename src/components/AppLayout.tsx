import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  LayoutDashboard,
  Layers,
  CheckSquare,
  CalendarDays,
  Flame,
  Target,
  Timer,
  BarChart2,
  Palette,
  Crown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Logo } from "./AuthShell";
import { signOut } from "@/lib/supabase-auth";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";

const nav = [
  { to: "/painel", label: "Painel", icon: LayoutDashboard },
  { to: "/modos", label: "Modos", icon: Layers },
  { to: "/tarefas", label: "Tarefas", icon: CheckSquare },
  { to: "/calendario", label: "Calendário", icon: CalendarDays },
  { to: "/habitos", label: "Hábitos & Metas", icon: Flame },
  { to: "/foco", label: "Foco", icon: Timer },
  { to: "/estatisticas", label: "Estatísticas", icon: BarChart2 },
];

const navBottom = [
  { to: "/configuracoes", label: "Temas & Config.", icon: Palette },
  { to: "/planos", label: "Planos", icon: Crown },
];

function NavItem({ to, label, icon: Icon }: { to: string; label: string; icon: React.ElementType }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + "/");
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="h-4.5 w-4.5 shrink-0" size={18} />
      <span>{label}</span>
    </Link>
  );
}

export function AppLayout({ children, user }: { children: ReactNode; user: { email: string; nome: string } }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleSair() {
    await signOut();
    navigate({ to: "/entrar", replace: true });
  }

  const sidebar = (
    <aside className="flex h-full flex-col gap-1 p-4">
      <div className="mb-4 px-1 pt-2">
        <Logo />
      </div>
      <nav className="flex flex-1 flex-col gap-0.5">
        {nav.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>
      <div className="mt-2 flex flex-col gap-0.5 border-t border-border pt-4">
        {navBottom.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 px-3 py-2">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-xs font-semibold text-foreground">{user.nome}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <button
            onClick={handleSair}
            title="Sair"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute left-0 top-0 h-full w-64 bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)} className="shrink-0">
            <Menu size={20} />
          </Button>
          <Logo />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
