"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/useSessionStore";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

export default function RootPage() {
  const router = useRouter();
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const activeProfileId = useSessionStore((s) => s.activeProfileId);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!activeProfileId) {
      router.replace("/profiles");
    } else {
      router.replace("/browse");
    }
  }, [hasHydrated, isAuthenticated, activeProfileId, router]);

  return <FullScreenLoader />;
}
