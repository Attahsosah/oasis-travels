/**
 * Motion primitives (Phase 2).
 *
 * Consistent, centrally tunable building blocks for the site's animation
 * language. Every primitive honors `prefers-reduced-motion` via the shared
 * `useReducedMotion` hook, swapping to an instant/static state.
 */
export { Reveal } from "./reveal";
export { Parallax } from "./parallax";
export { TiltCard } from "./tilt-card";
export { AnimatedWords } from "./animated-words";
export { Marquee } from "./marquee";
export { MagneticButton } from "./magnetic-button";
export { RippleButton } from "./ripple-button";
export { FloatingCard } from "./floating-card";
