"use client";

import { CalendarDays, FolderKanban, GraduationCap, Info, LibraryBig, Menu, Microscope, Users, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { tileColor, tileColors } from "@/components/ui/variants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { HandNote } from "@/components/ui/HandNote";
import { Tag } from "@/components/ui/Tag";
import { siteConfig } from "@/config/site";
import { overlay, popIn, staggerParent } from "@/lib/motion/presets";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const navIcons = {
  "/about": Info,
  "/events": CalendarDays,
  "/projects": FolderKanban,
  "/mentors": GraduationCap,
  "/team": Users,
  "/research": Microscope,
  "/resources": LibraryBig,
} as const;

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
              className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-bg dot-grid"
            >
              <div className="h-16 shrink-0 border-b-brutal bg-bg">
                <Container className="flex h-full items-center gap-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Logo onClick={close} />
                    <Tag color="lilac" className="hidden sm:inline-flex">
                      {siteConfig.version}
                    </Tag>
                    <HandNote className="hidden text-lg md:inline-flex">
                      {siteConfig.headerNote}
                    </HandNote>
                  </div>
                  <div className="ml-auto flex shrink-0 items-center gap-2">
                    <ThemeToggle />
                    <button
                      type="button"
                      onClick={close}
                      className="inline-flex size-10 press items-center justify-center brutal bg-surface text-ink focus-ring"
                    >
                      <X aria-hidden="true" className="size-5" />
                      <span className="sr-only">Close menu</span>
                    </button>
                  </div>
                </Container>
              </div>

              <nav
                aria-label="Menu"
                className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-rows-[minmax(0,1fr)_auto] gap-4 px-4 py-5 md:px-6"
              >
                <m.ul
                  variants={staggerParent()}
                  initial="hidden"
                  animate="show"
                  className="grid min-h-0 grid-cols-2 grid-rows-4 gap-3 sm:grid-cols-3 sm:grid-rows-3"
                >
                  {siteConfig.nav.map((link, index) => {
                    const Icon = navIcons[link.href as keyof typeof navIcons];
                    return (
                      <m.li key={link.href} variants={popIn} className="min-h-0">
                        <Link
                          href={link.href}
                          onClick={close}
                          className={cn(
                            "inline-flex h-full min-h-0 w-full press items-center justify-center gap-2.5 brutal px-3 py-2 text-center font-display text-base font-bold no-underline focus-ring sm:text-lg md:text-xl",
                            tileColor({ color: linkColors[index % linkColors.length] }),
                          )}
                        >
                          {Icon && (
                            <span className="grid size-6 shrink-0 place-items-center">
                              <Icon aria-hidden="true" className="block size-5" strokeWidth={1.8} />
                            </span>
                          )}
                          <span>{link.label}</span>
                        </Link>
                      </m.li>
                    );
                  })}
                </m.ul>
                <div className="flex justify-center">
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
