"use client";

import { create } from "zustand";

interface ModalState {
  titleId: string | null;
  open: (titleId: string) => void;
  close: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  titleId: null,
  open: (titleId) => set({ titleId }),
  close: () => set({ titleId: null }),
}));
