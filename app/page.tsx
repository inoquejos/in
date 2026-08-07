"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";

export default function RootPage() {
  const router = useRouter();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(currentProfileId ? "/browse" : "/profiles");
  }, [hasHydrated, currentProfileId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <span className="font-display animate-pulse text-4xl tracking-wide text-accent">NOVASTREAM</span>
    </div>
  );
}
