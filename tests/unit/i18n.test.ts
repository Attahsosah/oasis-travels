import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getDirection,
  isLocale,
  locales,
} from "@/lib/i18n/config";
import { resolveText } from "@/lib/i18n/resolve";

describe("i18n config", () => {
  it("recognizes supported locales only", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("de")).toBe(false);
  });

  it("exposes a direction per locale", () => {
    expect(getDirection("en")).toBe("ltr");
    expect(getDirection("fr")).toBe("ltr");
  });

  it("includes the default locale", () => {
    expect(locales).toContain(defaultLocale);
  });
});

describe("resolveText", () => {
  const dict = {
    hero: { title: "Hi" },
    nested: { a: { b: "deep" } },
  };

  it("resolves a dot-path", () => {
    expect(resolveText(dict, "hero.title")).toBe("Hi");
    expect(resolveText(dict, "nested.a.b")).toBe("deep");
  });

  it("returns the fallback (or the path) when missing", () => {
    expect(resolveText(dict, "missing.key")).toBe("missing.key");
    expect(resolveText(dict, "missing.key", "fallback")).toBe("fallback");
  });
});
