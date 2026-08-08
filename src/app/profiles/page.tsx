"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Check } from "lucide-react";
import { useSessionStore } from "@/store/useSessionStore";
import RequireSession from "@/components/auth/RequireSession";
import { cn } from "@/lib/utils";

function ProfilesContent() {
  const router = useRouter();
  const profiles = useSessionStore((s) => s.profiles);
  const selectProfile = useSessionStore((s) => s.selectProfile);
  const addProfile = useSessionStore((s) => s.addProfile);
  const removeProfile = useSessionStore((s) => s.removeProfile);
  const [managing, setManaging] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsKids, setNewIsKids] = useState(false);

  function choose(profileId: string) {
    if (managing) return;
    selectProfile(profileId);
    router.push("/browse");
  }

  function submitAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    addProfile(newName.trim(), newIsKids);
    setNewName("");
    setNewIsKids(false);
    setAdding(false);
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-nx-bg px-4 py-16">
      <span className="mb-10 text-2xl font-black tracking-tight text-nx-red sm:mb-14 sm:text-3xl">NFLIX</span>
      <h1 className="mb-8 text-3xl font-medium text-white sm:mb-10 sm:text-5xl">
        {managing ? "Manage Profiles" : "Who's watching?"}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {profiles.map((p) => (
          <div key={p.id} className="group relative w-24 sm:w-36">
            <button onClick={() => choose(p.id)} className="flex flex-col items-center gap-3 w-full">
              <div className="relative">
                <div
                  className={cn(
                    "flex h-24 w-24 items-center justify-center rounded-md text-4xl font-bold text-white transition sm:h-36 sm:w-36",
                    !managing && "group-hover:ring-4 group-hover:ring-white",
                  )}
                  style={{ backgroundColor: p.avatarColor }}
                >
                  {p.name.slice(0, 1).toUpperCase()}
                  {managing && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60">
                      <Pencil size={28} className="text-white" />
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm text-nx-text-muted group-hover:text-white sm:text-base">{p.name}</span>
              {p.isKids && (
                <span className="rounded bg-nx-bg-card px-2 py-0.5 text-[10px] font-semibold text-yellow-400">
                  KIDS
                </span>
              )}
            </button>
            {managing && profiles.length > 1 && (
              <button
                onClick={() => removeProfile(p.id)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-nx-red text-xs text-white"
                aria-label={`Delete ${p.name}`}
              >
                ×
              </button>
            )}
          </div>
        ))}

        {profiles.length < 5 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex w-24 flex-col items-center gap-3 sm:w-36"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-nx-text-muted text-nx-text-muted hover:border-white hover:text-white sm:h-36 sm:w-36">
              <Plus size={40} />
            </div>
            <span className="text-sm text-nx-text-muted hover:text-white sm:text-base">Add Profile</span>
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={submitAdd} className="mt-8 flex w-full max-w-sm flex-col gap-3 rounded border border-white/10 bg-nx-bg-card p-5">
          <input
            autoFocus
            placeholder="Profile name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="rounded border border-white/20 bg-[#333] px-3 py-2 text-white placeholder:text-nx-text-muted focus:border-white focus:outline-none"
          />
          <label className="flex items-center gap-2 text-sm text-nx-text-muted">
            <input type="checkbox" checked={newIsKids} onChange={(e) => setNewIsKids(e.target.checked)} />
            Kids profile
          </label>
          <div className="flex gap-2">
            <button type="submit" className="rounded bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/80 cursor-pointer">
              Save
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded border border-white/30 px-4 py-2 text-sm text-white hover:border-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <button
        onClick={() => setManaging((v) => !v)}
        className="mt-10 flex items-center gap-2 rounded border border-nx-text-muted px-6 py-2 text-sm tracking-wide text-nx-text-muted hover:border-white hover:text-white sm:mt-14 sm:text-base cursor-pointer"
      >
        {managing ? (
          <>
            <Check size={16} /> Done
          </>
        ) : (
          "Manage Profiles"
        )}
      </button>
    </div>
  );
}

export default function ProfilesPage() {
  return (
    <RequireSession level="auth">
      <ProfilesContent />
    </RequireSession>
  );
}
