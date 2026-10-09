import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Arrow } from "./Doodle";

const handNoteVariants = cva(
  "inline-flex items-center gap-1 font-hand text-xl leading-tight font-semibold",
  {
    variants: {
      // Every tone passes 4.5:1 on paper, surface and highlight. On colored tiles use `ink`.
      tone: {
        ink: "text-ink",
        link: "text-link",
        primary: "text-primary",
      },
    },
    defaultVariants: { tone: "link" },
  },
);

const arrowRotation = {
  left: "order-first rotate-180 -scale-y-100",
  right: "",
  down: "rotate-90",
  up: "-rotate-90",
} as const;

export type HandNoteProps = VariantProps<typeof handNoteVariants> & {
  children: ReactNode;
  /** Small doodle arrow pointing at the thing the note is about. */
  arrow?: keyof typeof arrowRotation;
  /** Hide from assistive tech when the note only repeats nearby info (default). */
  decorative?: boolean;
  className?: string;
};

/** Handwritten side-note ("start here!"). Max ~6 words; never essential information. */
export function HandNote({ tone, arrow, decorative = true, className, children }: HandNoteProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      className={cn(handNoteVariants({ tone }), className)}
    >
      <span>{children}</span>
      {arrow && <Arrow className={cn("h-5 w-8 shrink-0", arrowRotation[arrow])} />}
    </span>
  );
}
