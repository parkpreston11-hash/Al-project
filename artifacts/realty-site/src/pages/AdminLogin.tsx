import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAdminLogin } from "@workspace/api-client-react";
import { Home as HomeIcon, Lock } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);
  const login = useAdminLogin();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  function onSubmit(values: FormValues) {
    setError(null);
    login.mutate({ data: { password: values.password } }, {
      onSuccess: (data) => {
        localStorage.setItem("admin_token", data.token);
        setLocation("/admin/dashboard");
      },
      onError: () => {
        setError("Invalid password. Please try again.");
        form.setValue("password", "");
      },
    });
  }

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="py-6 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="bg-white text-primary p-2 rounded-sm">
            <HomeIcon size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-none text-white">Go Big Al Williams</span>
            <span className="text-[10px] uppercase tracking-widest text-white/60">Real Estate & Finance</span>
          </div>
        </Link>
      </header>

      {/* Login Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <Lock size={22} className="text-accent" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-white mb-2">Agent Login</h1>
            <p className="text-white/60 text-sm">Enter your password to access the dashboard.</p>
          </div>

          <Card className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" data-testid="form-admin-login">
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-accent"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {error && (
                  <p className="text-red-400 text-sm text-center" data-testid="login-error">{error}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                  disabled={login.isPending}
                  data-testid="button-login"
                >
                  {login.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
          </Card>

          <p className="text-center text-white/40 text-xs mt-6">
            For authorized agents only.
          </p>
        </div>
      </div>
    </div>
  );
}
