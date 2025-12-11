import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/components/header";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="flex min-h-screen flex-col text-foreground">
        <Header />
        <main className="grow p-4 container mx-auto">
          <Outlet />
        </main>
        <footer className="border-t py-4">
          <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-3">
            <span>Made with 💜 by Himansu Thapa</span>
            <span className="opacity-40">•</span>
            <a
              href="https://github.com/HimansuThapa2059/hypenews"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
      {/* <ReactQueryDevtools position="right" />
      <TanStackRouterDevtools position="bottom-left" /> */}
    </>
  );
}
