"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/useSessionStore";
import TitleArt from "@/components/ui/TitleArt";

export default function LoginPage() {
  const router = useRouter();
  const login = useSessionStore((s) => s.login);
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (hasHydrated && isAuthenticated) router.replace("/profiles");
  }, [hasHydrated, isAuthenticated, router]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 4) {
      setError("Your password must be at least 4 characters long.");
      return;
    }
    setError("");
    login(email.trim());
    router.replace("/profiles");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="absolute inset-0">
        <TitleArt seed="login-backdrop" genres={["Sci-Fi", "Action"]} className="h-full w-full" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <header className="relative z-10 px-4 py-5 sm:px-12">
        <span className="text-2xl font-black tracking-tight text-nx-red sm:text-3xl">NFLIX</span>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md rounded-md bg-black/75 p-8 sm:p-14">
          <h1 className="mb-6 text-2xl font-bold text-white sm:text-3xl">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full rounded border border-white/20 bg-[#333] px-4 py-3.5 text-white placeholder:text-nx-text-muted focus:border-white focus:outline-none"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full rounded border border-white/20 bg-[#333] px-4 py-3.5 text-white placeholder:text-nx-text-muted focus:border-white focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-nx-red">{error}</p>}
            <button
              type="submit"
              className="w-full rounded bg-nx-red py-3.5 font-semibold text-white transition-colors hover:bg-nx-red-dark cursor-pointer"
            >
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
            <p className="text-center text-xs text-nx-text-muted">
              This is a demo — any email/password combination signs you in.
            </p>
          </form>

          <div className="mt-8 text-nx-text-muted">
            {mode === "signin" ? (
              <p>
                New to NFLIX?{" "}
                <button className="font-semibold text-white hover:underline cursor-pointer" onClick={() => setMode("signup")}>
                  Sign up now
                </button>
                .
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button className="font-semibold text-white hover:underline cursor-pointer" onClick={() => setMode("signin")}>
                  Sign in
                </button>
                .
              </p>
            )}
            <p className="mt-3 text-xs">
              <button
                className="hover:underline cursor-pointer"
                onClick={() => {
                  login("guest@nflix.demo");
                  router.replace("/profiles");
                }}
              >
                Just exploring? Continue as guest →
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
