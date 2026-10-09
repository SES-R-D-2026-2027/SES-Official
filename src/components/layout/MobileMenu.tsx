"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tileColor, tileColors } from "@/components/ui/variants";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { overlay, popIn, staggerParent } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const linkColors = tileColors.filter((color) => color !== "paper");

/**
 * Menu button + full-screen menu. Uses a native modal <dialog>: the rest of the page is inert
 * (focus stays inside), Esc closes it and focus returns to the menu button.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => setOpen(true)}
        className="inline-flex size-10 press items-center justify-center brutal bg-accent text-on-accent focus-ring"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="Site menu"
        // Esc: play the exit animation instead of closing instantly.
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        // Closed by the browser anyway (e.g. repeated Esc): keep state in sync.
        onClose={close}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
          {open && (
            <m.div
              key="menu"
              variants={overlay}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex min-h-full flex-col bg-bg dot-grid"
            >
              <div className="flex h-16 items-center justify-between bg-bg px-4 border-b-brutal md:px-6">
                <Logo onClick={close} />
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex size-10 press items-center justify-center brutal bg-surface text-ink focus-ring"
                >
                  <X aria-hidden="true" className="size-5" />
                  <span className="sr-only">Close menu</span>
                </button>
              </div>

              <nav
                aria-label="Menu"
                className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 md:px-6"
              >
                <m.ul
                  variants={staggerParent()}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-4"
                >
                  {siteConfig.nav.map((link, index) => (
                    <m.li key={link.href} variants={popIn}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className={cn(
                          "inline-flex press items-center gap-3 brutal px-4 py-2 font-display text-h2 font-bold no-underline focus-ring",
                          tileColor({ color: linkColors[index % linkColors.length] }),
                        )}
                      >
                        {link.label}
                      </Link>
                    </m.li>
                  ))}
                </m.ul>
                <div>
                  <Button href={siteConfig.cta.href} arrow size="lg" onClick={close}>
                    {siteConfig.cta.label}
                  </Button>
                </div>
              </nav>
            </m.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
