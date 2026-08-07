"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Profile } from "@/lib/types";

const AVATAR_COLORS = ["#e50914", "#0071eb", "#00a86b", "#f5a623", "#8b5cf6", "#ec4899"];

export const DEFAULT_PROFILES: Profile[] = [
  { id: "p1", name: "Daniel", isKids: false, avatarSeed: "Daniel", avatarColor: AVATAR_COLORS[0] },
  { id: "p2", name: "Alex", isKids: false, avatarSeed: "Alex", avatarColor: AVATAR_COLORS[1] },
  { id: "p3", name: "Kids", isKids: true, avatarSeed: "Kids", avatarColor: AVATAR_COLORS[3] },
];

interface SessionState {
  isAuthenticated: boolean;
  email: string | null;
  profiles: Profile[];
  activeProfileId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (email: string) => void;
  logout: () => void;
  selectProfile: (profileId: string) => void;
  exitProfile: () => void;
  addProfile: (name: string, isKids: boolean) => void;
  removeProfile: (profileId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: null,
      profiles: DEFAULT_PROFILES,
      activeProfileId: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (email) => set({ isAuthenticated: true, email }),
      logout: () => set({ isAuthenticated: false, email: null, activeProfileId: null }),
      selectProfile: (profileId) => set({ activeProfileId: profileId }),
      exitProfile: () => set({ activeProfileId: null }),
      addProfile: (name, isKids) =>
        set((state) => {
          if (state.profiles.length >= 5) return state;
          const color = AVATAR_COLORS[state.profiles.length % AVATAR_COLORS.length];
          const profile: Profile = {
            id: `p${Date.now()}`,
            name,
            isKids,
            avatarSeed: name || "New",
            avatarColor: color,
          };
          return { profiles: [...state.profiles, profile] };
        }),
      removeProfile: (profileId) =>
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== profileId),
          activeProfileId: state.activeProfileId === profileId ? null : state.activeProfileId,
        })),
    }),
    {
      name: "nx-session",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
