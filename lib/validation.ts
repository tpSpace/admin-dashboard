// src/lib/validation.ts
import * as z from "zod";

export const loginSchema = z.object({
  phoneNumber: z.string().optional(), // Not used in API, just for UI
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginForm = z.infer<typeof loginSchema>;
