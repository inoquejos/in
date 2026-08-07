"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import InfoModal from "@/components/InfoModal";

interface TitleModalContextValue {
  open: (titleId: string) => void;
  close: () => void;
}

const TitleModalContext = createContext<TitleModalContextValue | null>(null);

export function TitleModalProvider({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const open = useCallback((titleId: string) => setOpenId(titleId), []);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <TitleModalContext.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>{openId && <InfoModal titleId={openId} onClose={close} />}</AnimatePresence>
    </TitleModalContext.Provider>
  );
}

export function useTitleModal() {
  const ctx = useContext(TitleModalContext);
  if (!ctx) throw new Error("useTitleModal must be used within TitleModalProvider");
  return ctx;
}
