"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LikeValue = "like" | "dislike" | null;

interface ProfileData {
  myList: string[];
  likes: Record<string, LikeValue>;
  progress: Record<string, number>; // titleId -> 0-100
  continueOrder: string[]; // most-recently-watched first
}

// Stable, shared references for "no data yet" so selectors that read into an
// unpopulated profile return the SAME object/array on every call. zustand's
// useSyncExternalStore snapshot would otherwise see a "new" value each render
// (a freshly allocated object) and re-render forever.
const EMPTY_PROFILE_DATA: ProfileData = { myList: [], likes: {}, progress: {}, continueOrder: [] };
export const EMPTY_ID_LIST: string[] = [];

interface WatchlistState {
  byProfile: Record<string, ProfileData>;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  ensure: (profileId: string) => ProfileData;
  isInMyList: (profileId: string, titleId: string) => boolean;
  toggleMyList: (profileId: string, titleId: string) => void;
  getLike: (profileId: string, titleId: string) => LikeValue;
  setLike: (profileId: string, titleId: string, value: LikeValue) => void;
  getProgress: (profileId: string, titleId: string) => number;
  setProgress: (profileId: string, titleId: string, percent: number) => void;
  removeFromContinueWatching: (profileId: string, titleId: string) => void;
  continueWatchingIds: (profileId: string) => string[];
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      byProfile: {},
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      ensure: (profileId) => get().byProfile[profileId] ?? EMPTY_PROFILE_DATA,
      isInMyList: (profileId, titleId) => get().ensure(profileId).myList.includes(titleId),
      toggleMyList: (profileId, titleId) =>
        set((state) => {
          const data = state.byProfile[profileId] ?? EMPTY_PROFILE_DATA;
          const inList = data.myList.includes(titleId);
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: {
                ...data,
                myList: inList ? data.myList.filter((id) => id !== titleId) : [titleId, ...data.myList],
              },
            },
          };
        }),
      getLike: (profileId, titleId) => get().ensure(profileId).likes[titleId] ?? null,
      setLike: (profileId, titleId, value) =>
        set((state) => {
          const data = state.byProfile[profileId] ?? EMPTY_PROFILE_DATA;
          const current = data.likes[titleId] ?? null;
          const next = current === value ? null : value;
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: { ...data, likes: { ...data.likes, [titleId]: next } },
            },
          };
        }),
      getProgress: (profileId, titleId) => get().ensure(profileId).progress[titleId] ?? 0,
      setProgress: (profileId, titleId, percent) =>
        set((state) => {
          const data = state.byProfile[profileId] ?? EMPTY_PROFILE_DATA;
          const order = [titleId, ...data.continueOrder.filter((id) => id !== titleId)].slice(0, 20);
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: {
                ...data,
                progress: { ...data.progress, [titleId]: percent },
                continueOrder: percent >= 96 ? data.continueOrder.filter((id) => id !== titleId) : order,
              },
            },
          };
        }),
      removeFromContinueWatching: (profileId, titleId) =>
        set((state) => {
          const data = state.byProfile[profileId] ?? EMPTY_PROFILE_DATA;
          return {
            byProfile: {
              ...state.byProfile,
              [profileId]: {
                ...data,
                continueOrder: data.continueOrder.filter((id) => id !== titleId),
                progress: { ...data.progress, [titleId]: 0 },
              },
            },
          };
        }),
      continueWatchingIds: (profileId) => get().ensure(profileId).continueOrder,
    }),
    {
      name: "novastream-watchlist",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
