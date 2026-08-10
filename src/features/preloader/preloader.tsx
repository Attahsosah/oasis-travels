"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useI18n } from "@/lib/i18n/provider";

const SEEN_KEY = "kz_preloader_seen";
// Hard cap so the site is never blocked if the video stalls (video is ~10s).
const MAX_MS = 12000;
const FADE_MS = 600;

type Phase = "show" | "hiding" | "gone";

/**
 * Full-screen intro preloader: plays the brand video (plane → Kazeline logo)
 * once per session, then fades out to reveal the site.
 *
 * Robustness: shows only once per browser session (sessionStorage), is skipped
 * entirely under reduced motion, can be dismissed by tap/"Skip", and always
 * clears itself via an `onEnded` / `onError` handler and a hard timeout — so a
 * slow or failed video can never trap the visitor. The overlay background
 * matches the video's off-white end frame so letterboxing is seamless.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const { locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("show");
  const videoRef = useRef<HTMLVideoElement>(null);

  const finish = useCallback(() => {
    setPhase((p) => (p === "show" ? "hiding" : p));
  }, []);

  // On mount: returning visitors and reduced-motion users skip instantly.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) {
      setPhase("gone");
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(finish, MAX_MS);

    const v = videoRef.current;
    if (v) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => finish());
    }

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, [reduce, finish]);

  // Once fading, mark seen and unmount after the fade; restore scrolling.
  useEffect(() => {
    if (phase !== "hiding") return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => {
      document.body.style.overflow = "";
      setPhase("gone");
    }, FADE_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: "#EEEEEE",
        opacity: phase === "hiding" ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
      }}
      role="status"
      aria-label="Kazeline Agency"
      onClick={finish}
    >
      <video
        ref={videoRef}
        src="/kazeline-intro.mp4"
        muted
        playsInline
        autoPlay
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="h-full w-full object-contain"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute bottom-6 right-6 rounded-full border border-black/10 bg-white/70 px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white"
      >
        {locale === "fr" ? "Passer" : "Skip"}
      </button>
    </div>
  );
}
