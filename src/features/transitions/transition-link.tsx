"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

import { useTransition } from "./transition-provider";

type TransitionLinkProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  "href"
> & { href: string };

/**
 * Drop-in replacement for `next/link` that plays a cinematic transition on
 * left-click navigation. Modifier/middle clicks and external behaviours fall
 * through to the native link, and any caller `onClick` still runs first. Under
 * reduced motion the provider navigates instantly.
 */
export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: TransitionLinkProps) {
  const { navigate } = useTransition();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    navigate(href);
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
