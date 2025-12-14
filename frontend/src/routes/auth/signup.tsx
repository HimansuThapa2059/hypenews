import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/field-info";

import { signupFormSchema } from "@/shared/validators";
import { getErrorMessage } from "@/utils/getZodErrorMessage";
import { Google } from "@/components/logos/google";
import { GitHub } from "@/components/logos/github";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

const signupSearchSchema = z.object({
  redirect: z.string().optional().default("/"),
});

export const Route = createFileRoute("/auth/signup")({
  component: Signup,
  validateSearch: (search) => signupSearchSchema.parse(search),
});

function Signup() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validators: {
      onChange: signupFormSchema,
      onSubmit: signupFormSchema,
    },

    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: async () => {
            toast.success("Welcome!", {
              description: "Your account has been created successfully.",
            });
            await queryClient.invalidateQueries({ queryKey: ["user"] });
            router.invalidate();
            await navigate({ to: search.redirect });
          },
          onError: async ({ error }) => {
            toast.error("Registration failed", {
              description:
                error.message || "There was a problem creating your account",
            });
          },
        }
      );
    },
  });

  type SignupFieldName = "name" | "email" | "password" | "confirmPassword";

  const renderField = (
    name: SignupFieldName,
    type: string,
    placeholder: string
  ) => (
    <form.Field
      name={name}
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <div className="grid gap-2 sm:gap-4" data-invalid={isInvalid}>
            <Label htmlFor={field.name} className="tracking-wide">
              {name === "confirmPassword"
                ? "Confirm Password"
                : name.charAt(0).toUpperCase() + name.slice(1)}
            </Label>
            <Input
              id={field.name}
              type={type}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder={placeholder}
              aria-invalid={isInvalid}
            />
            {isInvalid && (
              <FieldInfo message={getErrorMessage(field.state.meta.errors)} />
            )}
          </div>
        );
      }}
    />
  );

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="max-w-md w-full border border-border/20 rounded-2xl shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <CardHeader className="text-center gap-1 sm:gap-2 py-2">
            <CardTitle className="text-2xl font-semibold">
              Sign Up to HypeNews
            </CardTitle>
            <CardDescription>
              Please enter your details to sign up
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 px-6 py-4">
            <div className="grid gap-5">
              {renderField("name", "text", "Enter your name")}
              {renderField("email", "email", "Enter your email")}
              {renderField("password", "password", "Enter your password")}
              {renderField(
                "confirmPassword",
                "password",
                "Confirm your password"
              )}

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full h-10 mt-2 cursor-pointer"
                  >
                    {isSubmitting ? "..." : "Sign up to HypeNews"}
                  </Button>
                )}
              />
            </div>

            <div className="flex items-center">
              <div className="flex-1 h-px bg-border" />
              <span className="px-3 text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-3 w-full cursor-pointer"
              >
                <Google className="w-5 h-5" />
                Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-3 w-full cursor-pointer"
              >
                <GitHub className="w-5 h-5" />
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm tracking-wide">
              Already have an account?{" "}
              <Link to="/auth/login" search={search} className="underline">
                Log in
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
