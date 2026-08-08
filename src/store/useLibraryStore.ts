"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { WatchProgress } from "@/lib/types";

interface LibraryState {
  /** profileId -> set of titleIds in "My List" */
  watchlists: Record<string, string[]>;
  /** profileId -> titleId -> 1 (liked) | -1 (disliked) */
  reactions: Record<string, Record<string, 1 | -1>>;
  /** profileId -> titleId -> progress */
  progress: Record<string, Record<string, WatchProgress>>;

  isInWatchlist: (profileId: string, titleId: string) => boolean;
  toggleWatchlist: (profileId: string, titleId: string) => void;
  setReaction: (profileId: string, titleId: string, reaction: 1 | -1 | 0) => void;
  getReaction: (profileId: string, titleId: string) => 1 | -1 | 0;
  updateProgress: (profileId: string, entry: WatchProgress) => void;
  getProgress: (profileId: string, titleId: string) => WatchProgress | undefined;
  continueWatching: (profileId: string) => WatchProgress[];
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      watchlists: {},
      reactions: {},
      progress: {},

      isInWatchlist: (profileId, titleId) => {
        const list = get().watchlists[profileId] ?? [];
        return list.includes(titleId);
      },

      toggleWatchlist: (profileId, titleId) =>
        set((state) => {
          const current = state.watchlists[profileId] ?? [];
          const next = current.includes(titleId)
            ? current.filter((id) => id !== titleId)
            : [...current, titleId];
          return { watchlists: { ...state.watchlists, [profileId]: next } };
        }),

      setReaction: (profileId, titleId, reaction) =>
        set((state) => {
          const profileReactions = { ...(state.reactions[profileId] ?? {}) };
          if (reaction === 0) {
            delete profileReactions[titleId];
          } else {
            profileReactions[titleId] = reaction;
          }
          return { reactions: { ...state.reactions, [profileId]: profileReactions } };
        }),

      getReaction: (profileId, titleId) => {
        return get().reactions[profileId]?.[titleId] ?? 0;
      },

      updateProgress: (profileId, entry) =>
        set((state) => {
          const profileProgress = { ...(state.progress[profileId] ?? {}) };
          profileProgress[entry.titleId] = entry;
          return { progress: { ...state.progress, [profileId]: profileProgress } };
        }),

      getProgress: (profileId, titleId) => {
        return get().progress[profileId]?.[titleId];
      },

      continueWatching: (profileId) => {
        const map = get().progress[profileId] ?? {};
        return Object.values(map)
          .filter((p) => p.progressSeconds > 5 && p.progressSeconds < p.durationSeconds * 0.95)
          .sort((a, b) => b.updatedAt - a.updatedAt);
      },
    }),
    {
      name: "nx-library",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
