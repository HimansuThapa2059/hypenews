import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { defaultHomeSearchParams } from "@/routes";

export function NotFound() {
  return (
    <div className="flex size-full items-center justify-center p-2 text-2xl">
      <div className="flex flex-col items-center gap-4">
        <p className="text-4xl font-bold">404</p>
        <p className="text-lg">Page not found</p>
        <Button asChild>
          <Link to="/" search={defaultHomeSearchParams}>
            Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
