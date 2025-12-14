import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";
import { defaultHomeSearchParams } from "..";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      navigate({ to: "/", search: defaultHomeSearchParams });
    }
  }, [isPending, session, navigate]);

  return (
    <main className="w-full flex items-center justify-center">
      <Outlet />
    </main>
  );
}
