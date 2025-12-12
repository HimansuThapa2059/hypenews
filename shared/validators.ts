import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(1, "Please enter a password")
  .min(8, "Password must be at least 8 characters")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must include at least one special character (e.g., !@#$%)"
  );

// Schema for the API payload
export const signupApiSchema = z.object({
  name: z
    .string()
    .min(2, "Your name must be at least 2 characters")
    .max(50, "Your name cannot be longer than 50 characters"),
  email: z.email("Please enter a valid email address"),
  password: passwordSchema,
  callbackURL: z
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("").optional()),
});

// Schema for the frontend form
export const signupFormSchema = signupApiSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormInput = z.infer<typeof signupFormSchema>;
export type SignupApiInput = z.infer<typeof signupApiSchema>;

export const signinApiSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: passwordSchema,
});

export const signinFormSchema = signinApiSchema;

export type SigninFormInput = z.infer<typeof signinFormSchema>;
export type SigninApiInput = z.infer<typeof signinApiSchema>;
