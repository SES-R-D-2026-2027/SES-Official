"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export type SiteTheme = "neo" | "dark";
const storageKey = "ses-theme";
const themeEvent = "ses-theme-change";

function syncFavicon(theme: SiteTheme) {
  const icon = document.getElementById("ses-theme-favicon") as HTMLLinkElement | null;
  if (icon) icon.href = theme === "dark" ? "/brand/favicon-dark.png?v=4" : "/brand/favicon-light.png?v=4";
}

/** Accessible, persistent light/dark theme control. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("neo");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(storageKey);
    } catch {
      // Storage can be unavailable in private browsing.
    }

    const current = saved === "dark" || saved === "neo" ? saved : document.documentElement.dataset.theme;
    const resolved: SiteTheme = current === "dark" ? "dark" : "neo";
    document.documentElement.dataset.theme = resolved;
    syncFavicon(resolved);
    setTheme(resolved);

    const syncTheme = (event: Event) => {
      const next = (event as CustomEvent<SiteTheme>).detail;
      if (next === "dark" || next === "neo") {
        setTheme(next);
        syncFavicon(next);
      }
    };

    window.addEventListener(themeEvent, syncTheme);
    return () => window.removeEventListener(themeEvent, syncTheme);
  }, []);


  const toggleTheme = () => {
    const next: SiteTheme = theme === "dark" ? "neo" : "dark";
    document.documentElement.dataset.theme = next;
    syncFavicon(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // The theme still changes for this session when storage is blocked.
    }
    setTheme(next);
    window.dispatchEvent(new CustomEvent<SiteTheme>(themeEvent, { detail: next }));
  };

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="inline-flex size-10 press items-center justify-center brutal rounded-brutal-sm bg-surface text-ink focus-ring"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}
