"use client";

import { m } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { pageEnter } from "@/lib/motion/presets";

// The first page load is never animated: its content (hero H1, LCP image) must paint
// straight from the server HTML. Only client-side navigations after that fade + slide in.
let hasLoaded = false;

/** Page-enter transition, rendered by app/template.tsx (which remounts on every navigation). */
export function PageTransition({ children }: { children: ReactNode }) {
  const [initial] = useState<"hidden" | false>(() => (hasLoaded ? "hidden" : false));

  useEffect(() => {
    hasLoaded = true;
  }, []);

  return (
    <m.div data-reveal="" variants={pageEnter} initial={initial} animate="show">
      {children}
    </m.div>
  );
}
