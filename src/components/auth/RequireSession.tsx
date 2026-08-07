"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/useSessionStore";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

interface RequireSessionProps {
  /** "auth" only requires a logged-in account; "profile" additionally requires an active profile. */
  level: "auth" | "profile";
  children: React.ReactNode;
}

/**
 * Client-side route guard. Waits for the persisted zustand session to rehydrate before
 * evaluating auth/profile state so we never flash-redirect a returning user.
 */
export default function RequireSession({ level, children }: RequireSessionProps) {
  const router = useRouter();
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const activeProfileId = useSessionStore((s) => s.activeProfileId);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (level === "profile" && !activeProfileId) {
      router.replace("/profiles");
    }
  }, [hasHydrated, isAuthenticated, activeProfileId, level, router]);

  const ready = hasHydrated && isAuthenticated && (level === "auth" || !!activeProfileId);

  if (!ready) return <FullScreenLoader />;
  return <>{children}</>;
}
