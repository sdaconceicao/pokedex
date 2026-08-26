"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { getStoredToken } from "@/lib/auth";
import type { Pokemon } from "@/types/graphql";
import { useAuthModal } from "./AuthModalProvider";

interface AddToGroupContextValue {
  requestOpen: (pokemon: Pokemon) => boolean;
  resumeFor: string | null;
  clearResume: () => void;
}

const AddToGroupContext = createContext<AddToGroupContextValue | null>(null);

export function useAddToGroup(): AddToGroupContextValue {
  const context = useContext(AddToGroupContext);
  if (!context) {
    throw new Error("useAddToGroup must be used within an AddToGroupProvider");
  }
  return context;
}

export default function AddToGroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { openSignIn, isAuthModalOpen } = useAuthModal();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const sawAuthModal = useRef(false);

  const requestOpen = useCallback(
    (pokemon: Pokemon) => {
      if (!user) {
        setPendingId(pokemon.id);
        openSignIn();
        return false;
      }
      return true;
    },
    [user, openSignIn],
  );

  const clearResume = useCallback(() => {
    setPendingId(null);
  }, []);

  const resumeFor = user && pendingId ? pendingId : null;

  useEffect(() => {
    if (isAuthModalOpen) {
      sawAuthModal.current = true;
    }
  }, [isAuthModalOpen]);

  // Dismissed auth modal without signing in clears the pending add.
  useEffect(() => {
    if (sawAuthModal.current && !isAuthModalOpen && !user && !getStoredToken() && pendingId) {
      sawAuthModal.current = false;
      setPendingId(null);
    }
  }, [isAuthModalOpen, user, pendingId]);

  const value = useMemo(
    () => ({ requestOpen, resumeFor, clearResume }),
    [requestOpen, resumeFor, clearResume],
  );

  return <AddToGroupContext.Provider value={value}>{children}</AddToGroupContext.Provider>;
}
