"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useProfileStore } from "@/store/useProfileStore";
import { cn } from "@/lib/utils";
import { Profile } from "@/lib/types";

const AVATAR_SWATCHES = ["#e50914", "#3b82f6", "#a855f7", "#22c55e", "#f59e0b", "#2dd4bf", "#fb7185"];
const MAX_PROFILES = 5;

export default function ProfilesPage() {
  const router = useRouter();
  const hasHydrated = useProfileStore((s) => s.hasHydrated);
  const profiles = useProfileStore((s) => s.profiles);
  const selectProfile = useProfileStore((s) => s.selectProfile);
  const addProfile = useProfileStore((s) => s.addProfile);
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const removeProfile = useProfileStore((s) => s.removeProfile);

  const [manageMode, setManageMode] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [adding, setAdding] = useState(false);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="font-display animate-pulse text-4xl tracking-wide text-accent">NOVASTREAM</span>
      </div>
    );
  }

  function pickProfile(p: Profile) {
    if (manageMode) {
      setEditing(p);
      return;
    }
    selectProfile(p.id);
    router.push("/browse");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16">
      <span className="font-display mb-10 text-3xl tracking-wide text-accent sm:mb-14 sm:text-4xl">
        NOVASTREAM
      </span>

      <AnimatePresence mode="wait">
        {editing ? (
          <EditProfileForm
            key="edit"
            profile={editing}
            onCancel={() => setEditing(null)}
            onSave={(patch) => {
              updateProfile(editing.id, patch);
              setEditing(null);
            }}
            onDelete={
              profiles.length > 1
                ? () => {
                    removeProfile(editing.id);
                    setEditing(null);
                  }
                : undefined
            }
          />
        ) : adding ? (
          <AddProfileForm
            key="add"
            onCancel={() => setAdding(false)}
            onSave={(name, isKids) => {
              addProfile(name, isKids);
              setAdding(false);
            }}
          />
        ) : (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <h1 className="mb-8 text-2xl text-white/90 sm:text-4xl">
              {manageMode ? "Manage Profiles" : "Who's watching?"}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => pickProfile(p)}
                  className="group flex flex-col items-center gap-2"
                >
                  <span
                    className={cn(
                      "relative flex h-20 w-20 items-center justify-center rounded-md text-3xl font-bold text-white transition sm:h-32 sm:w-32 sm:text-5xl",
                      "group-hover:ring-4 group-hover:ring-white"
                    )}
                    style={{ backgroundColor: p.avatarColor }}
                  >
                    {p.name.charAt(0).toUpperCase()}
                    {manageMode && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/60">
                        <Pencil size={26} className="text-white" />
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-white/70 group-hover:text-white sm:text-base">{p.name}</span>
                  {p.isKids && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                      Kids
                    </span>
                  )}
                </button>
              ))}

              {profiles.length < MAX_PROFILES && (
                <button
                  onClick={() => setAdding(true)}
                  className="group flex flex-col items-center gap-2"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-white/30 text-white/40 transition group-hover:border-white group-hover:text-white sm:h-32 sm:w-32">
                    <Plus size={40} />
                  </span>
                  <span className="text-sm text-white/70 group-hover:text-white sm:text-base">Add Profile</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setManageMode((v) => !v)}
              className={cn(
                "mt-12 rounded border px-6 py-2 text-sm font-medium uppercase tracking-wide transition",
                manageMode
                  ? "border-white bg-white text-black"
                  : "border-white/40 text-white/60 hover:border-white hover:text-white"
              )}
            >
              {manageMode ? "Done" : "Manage Profiles"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddProfileForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (name: string, isKids: boolean) => void;
}) {
  const [name, setName] = useState("");
  const [isKids, setIsKids] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-md border-y border-white/15 py-10 text-center"
    >
      <h2 className="mb-6 text-2xl text-white sm:text-3xl">Add Profile</h2>
      <div className="flex flex-col items-center gap-4">
        <span className="flex h-20 w-20 items-center justify-center rounded-md bg-white/10 text-3xl font-bold text-white/50 sm:h-28 sm:w-28">
          {name.charAt(0).toUpperCase() || "?"}
        </span>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          maxLength={20}
          className="w-64 border-b-2 border-white/30 bg-transparent px-2 py-2 text-center text-white outline-none focus:border-white"
        />
        <label className="flex items-center gap-2 text-sm text-white/70">
          <input type="checkbox" checked={isKids} onChange={(e) => setIsKids(e.target.checked)} className="accent-accent" />
          Kids Profile
        </label>
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          disabled={!name.trim()}
          onClick={() => onSave(name.trim(), isKids)}
          className="rounded border border-white bg-white px-8 py-2 font-medium text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="rounded border border-white/40 px-8 py-2 font-medium text-white/70 transition hover:border-white hover:text-white"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

function EditProfileForm({
  profile,
  onCancel,
  onSave,
  onDelete,
}: {
  profile: Profile;
  onCancel: () => void;
  onSave: (patch: Partial<Pick<Profile, "name" | "avatarColor">>) => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(profile.name);
  const [color, setColor] = useState(profile.avatarColor);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full max-w-md border-y border-white/15 py-10 text-center"
    >
      <h2 className="mb-6 text-2xl text-white sm:text-3xl">Edit Profile</h2>
      <div className="flex flex-col items-center gap-4">
        <span
          className="flex h-20 w-20 items-center justify-center rounded-md text-3xl font-bold text-white sm:h-28 sm:w-28"
          style={{ backgroundColor: color }}
        >
          {name.charAt(0).toUpperCase() || "?"}
        </span>
        <div className="flex gap-2">
          {AVATAR_SWATCHES.map((c) => (
            <button
              key={c}
              aria-label={`Choose color ${c}`}
              onClick={() => setColor(c)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full",
                color === c && "ring-2 ring-white ring-offset-2 ring-offset-background"
              )}
              style={{ backgroundColor: c }}
            >
              {color === c && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
          className="w-64 border-b-2 border-white/30 bg-transparent px-2 py-2 text-center text-white outline-none focus:border-white"
        />
        {profile.isKids && (
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/60">
            Kids Profile
          </span>
        )}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          disabled={!name.trim()}
          onClick={() => onSave({ name: name.trim(), avatarColor: color })}
          className="rounded border border-white bg-white px-8 py-2 font-medium text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="rounded border border-white/40 px-8 py-2 font-medium text-white/70 transition hover:border-white hover:text-white"
        >
          Cancel
        </button>
      </div>

      {onDelete && (
        <div className="mt-6">
          {confirmDelete ? (
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-white/70">Delete this profile?</span>
              <button onClick={onDelete} className="font-semibold text-accent hover:underline">
                Yes, delete
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-white/50 hover:underline">
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-accent"
            >
              <Trash2 size={14} /> Delete Profile
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
