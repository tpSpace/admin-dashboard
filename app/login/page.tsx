"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useAuthStore } from "@/lib/store/auth-store";
import { login } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "@/lib/validation";
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // data returns:
      // {
      //   email: "admin@admin.com",
      //   firstName: "lmao",
      //   lastName: "super_lmao",
      //   role: "ADMIN",
      //   token: "...",
      //   type: "Bearer",
      //   userId: "7a2a48c5-8352-4e17-9933-3623500c57bd"
      // }
      setAuth(data, data.token);
      // set token in cookies
      router.push("/dashboard");
      toast.success("Logged in successfully");
    },
    onError: () => {
      toast.error("Invalid credentials");
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate({ email: data.email, password: data.password });
  };

  return (
    <div className="h-screen grid place-items-center bg-background">
      <div className="max-w-md w-full px-8">
        <h1 className="text-3xl font-bold text-foreground text-center mb-8">
          Welcome back!
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 flex justify-center">
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
