// import { createFileRoute } from "@tanstack/react-router";
// import { useEffect } from "react";
// import { useNavigate } from "@tanstack/react-router";
// import { useSession } from "@/lib/auth";
// import { Loader2 } from "lucide-react";

// export const Route = createFileRoute("/_protected")({
//   component: CreatePostRoute,
// });

// function CreatePostRoute() {
//   const navigate = useNavigate();
//   const { data: session, isPending } = useSession();

//   useEffect(() => {
//     if (!isPending && !session?.user) {
//       navigate({ to: "/auth/login", search: { redirect: "/create-post" } });
//     }
//   }, [isPending, session, navigate]);

//   // TODO: remove this while using user check via beforeload tanstack router
//   if (isPending || !session?.user) {
//     return (
//       <div className="mx-auto mt-8 flex flex-col items-center justify-center">
//         <Loader2 className="animate-spin" />
//         <p className="mt-2 text-sm text-muted-foreground">Loading</p>
//       </div>
//     );
//   }

//   return <div>here is the form to create post</div>;
// }
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_protected")({
  component: CreatePostRoute,
});

function CreatePostRoute() {
  const navigate = useNavigate();
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="mx-auto mt-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-2 text-sm text-muted-foreground">Loading session...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto mt-16 max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-2">
          Oops! You&apos;re not logged in
        </h2>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
          To create a post, you need to log in first. It only takes a few
          seconds!
        </p>
        <Button
          variant="default"
          onClick={() =>
            navigate({
              to: "/auth/login",
              search: { redirect: "/create-post" },
            })
          }
          className="cursor-pointer"
        >
          Log in to Continue
        </Button>
      </div>
    );
  }

  return <div className="mx-auto mt-8">Here is the form to create a post</div>;
}
