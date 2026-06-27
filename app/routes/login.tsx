import { redirect, useFetcher } from "react-router";
import type { Route } from "./+types/login";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/Input";
import { Card, CardBody } from "~/components/ui/Card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { getUser } from "~/lib/auth.server";

export function meta(): Route.MetaDescriptors {
  return [{ title: "Login — Admin" }];
}

/**
 * If user is already logged in, redirect to admin dashboard.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const { user } = await getUser(request);
  if (user) throw redirect("/admin");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const { supabase, headers } = createSupabaseServerClient(request);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  return redirect("/admin", { headers });
}

export default function Login() {
  const fetcher = useFetcher<{ error?: string }>();
  const isSubmitting = fetcher.state !== "idle";

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-500/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-indigo-400">&lt;</span>
            Luthfi Admin
            <span className="text-indigo-400"> /&gt;</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        <Card>
          <CardBody className="p-6">
            {fetcher.data?.error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {fetcher.data.error}
              </div>
            )}

            <fetcher.Form method="post" className="space-y-4">
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="admin@example.com"
                required
                autoComplete="email"
              />

              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </fetcher.Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
