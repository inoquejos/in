"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";

export default function ProfileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const currentProfileId = useProfileStore((s) => s.currentProfileId);

  useEffect(() => {
    if (hasHydrated && !currentProfileId) router.replace("/profiles");
  }, [hasHydrated, currentProfileId, router]);

  if (!hasHydrated || !currentProfileId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="font-display animate-pulse text-4xl tracking-wide text-accent">NOVASTREAM</span>
      </div>
    );
  }

  return <>{children}</>;
}
