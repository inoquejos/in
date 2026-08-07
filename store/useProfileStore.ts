"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Profile } from "@/lib/types";

const AVATAR_COLORS = [
  "#e50914",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#f59e0b",
  "#2dd4bf",
  "#fb7185",
];

function makeProfile(name: string, isKids = false, colorIdx = 0): Profile {
  return {
    id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    avatarColor: AVATAR_COLORS[colorIdx % AVATAR_COLORS.length],
    isKids,
  };
}

interface ProfileState {
  profiles: Profile[];
  currentProfileId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  selectProfile: (id: string) => void;
  signOut: () => void;
  addProfile: (name: string, isKids: boolean) => void;
  updateProfile: (id: string, patch: Partial<Pick<Profile, "name" | "avatarColor">>) => void;
  removeProfile: (id: string) => void;
  currentProfile: () => Profile | undefined;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [makeProfile("Daniel", false, 0), makeProfile("Kids", true, 4)],
      currentProfileId: null,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      selectProfile: (id) => set({ currentProfileId: id }),
      signOut: () => set({ currentProfileId: null }),
      addProfile: (name, isKids) =>
        set((state) => ({
          profiles: [...state.profiles, makeProfile(name, isKids, state.profiles.length)],
        })),
      updateProfile: (id, patch) =>
        set((state) => ({
          profiles: state.profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      removeProfile: (id) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
          currentProfileId: state.currentProfileId === id ? null : state.currentProfileId,
        })),
      currentProfile: () => get().profiles.find((p) => p.id === get().currentProfileId),
    }),
    {
      name: "novastream-profiles",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
