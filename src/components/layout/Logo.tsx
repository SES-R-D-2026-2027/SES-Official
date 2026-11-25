"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Theme = "neo" | "dark";

/** One visible image element. The artwork swaps when the active site theme changes. */
export function Logo({ className, onClick }: { className?: string; onClick?: () => void }) {
  const [theme, setTheme] = useState<Theme>("neo");

  useEffect(() => {
    const syncTheme = () => {
      setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "neo");
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("ses-theme-change", syncTheme);

    return () => {
      observer.disconnect();
      window.removeEventListener("ses-theme-change", syncTheme);
    };
  }, []);

  const logoSrc = theme === "dark" ? "/brand/ses-logo-dark.png" : "/brand/ses-logo-light.png";

  return (
    <Link
      href="/"
      onClick={(event) => {
        onClick?.();
        const isPlainPrimaryClick =
          event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if (isPlainPrimaryClick && window.location.pathname === "/") {
          event.preventDefault();
          const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        }
      }}
      aria-label={`${siteConfig.name} home`}
      className={cn("inline-flex shrink-0 items-center rounded-full focus-ring", className)}
    >
      <span
        aria-hidden="true"
        className="ses-logo-shell"
        style={{
          display: "grid",
          width: "3.25rem",
          height: "3.25rem",
          minWidth: "3.25rem",
          minHeight: "3.25rem",
          flex: "0 0 3.25rem",
          placeItems: "center",
          overflow: "hidden",
          padding: "0.2rem",
          border: `2px solid ${theme === "dark" ? "#a1c1eb" : "#4e77ab"}`,
          borderRadius: "9999px",
          background: theme === "dark" ? "#08172b" : "#ffffff",
          boxShadow: `3px 3px 0 ${theme === "dark" ? "#a1c1eb" : "#4e77ab"}`,
        }}
      >
        <Image
          key={logoSrc}
          src={logoSrc}
          alt=""
          width={48}
          height={48}
          priority
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </span>
    </Link>
  );
}
