import useAuth from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);

    try {
      await login(data.email, data.password);

      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      setError(null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-200 dark:bg-neutral-900 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm md:max-w-md lg:max-w-lg shadow-soft-xl space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-center text-neutral-800 dark:text-neutral-100">
            Welcome Back!
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 text-center mt-2">
            Sign in to your account
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-800 dark:text-neutral-100">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="text-sm md:text-base"
                      {...field}
                    />
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
                  <FormLabel className="text-neutral-800 dark:text-neutral-100">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="text-sm md:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-3 text-sm md:text-base"
              disabled={form.formState.isSubmitted && !form.formState.isValid}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="flex justify-center text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
          <Link to="/register" className="hover:text-primary">
            New to our website? Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
