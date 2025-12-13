import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/__authLayout")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen  p-4">
      <Outlet />
    </div>
  );
}
