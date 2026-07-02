import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogin, useRegister } from "@/hooks/useAuth";
import MainLayout from "@/layouts/MainLayout";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const login = useLogin();
  const register = useRegister();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    const mutation = mode === "login" ? login : register;
    mutation.mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success(mode === "login" ? "Welcome back" : "Account created");
          navigate("/dashboard");
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.message || "Something went wrong"),
      },
    );
  };

  const isPending = login.isPending || register.isPending;

  return (
    <MainLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {mode === "login"
                ? "Sign in to manage your links."
                : "Start shortening links with full control."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full h-9 px-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full h-9 px-3 text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            <button
              type="submit"
              disabled={isPending}
              style={{ cursor: isPending ? "not-allowed" : "pointer" }}
              className="w-full h-9 text-sm font-medium bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors"
            >
              {isPending
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-zinc-900 dark:text-zinc-50 font-medium hover:underline"
              >
                {mode === "login" ? "Register" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
