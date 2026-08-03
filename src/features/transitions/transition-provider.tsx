"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { nextVariant, type TransitionVariant } from "./variants";

export type TransitionPhase = "idle" | "cover" | "reveal";

interface TransitionState {
  phase: TransitionPhase;
  variant: TransitionVariant;
  /** Called by the overlay when the cover animation finishes. */
  onCovered: () => void;
  /** Called by the overlay when the reveal animation finishes. */
  onRevealed: () => void;
  /** Trigger a cinematic navigation to `href`. */
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionState | null>(null);

/**
 * Orchestrates cinematic route transitions. Lives in the locale layout so its
 * state survives navigations: `navigate()` plays the cover animation, pushes
 * the route once covered, then plays the reveal. Under reduced motion it
 * navigates instantly with no overlay.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [variant, setVariant] = useState<TransitionVariant>("sunrise");
  const pendingHref = useRef<string | null>(null);
  const countRef = useRef(0);

  const navigate = useCallback(
    (href: string) => {
      if (reduceMotion) {
        router.push(href);
        return;
      }
      pendingHref.current = href;
      setVariant(nextVariant(countRef.current++));
      setPhase("cover");
    },
    [reduceMotion, router],
  );

  const onCovered = useCallback(() => {
    if (pendingHref.current) {
      router.push(pendingHref.current);
      pendingHref.current = null;
    }
    setPhase("reveal");
  }, [router]);

  const onRevealed = useCallback(() => {
    setPhase("idle");
  }, []);

  const value = useMemo<TransitionState>(
    () => ({ phase, variant, onCovered, onRevealed, navigate }),
    [phase, variant, onCovered, onRevealed, navigate],
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionState {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return ctx;
}
