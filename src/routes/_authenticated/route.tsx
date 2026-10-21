import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { sessaoAtual } from "@/lib/mock-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    const user = sessaoAtual();
    if (!user) throw redirect({ to: "/entrar" });
    return { user };
  },
  component: () => <Outlet />,
});
