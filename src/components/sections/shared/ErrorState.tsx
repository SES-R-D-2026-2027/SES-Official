import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Underline } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Sticker } from "@/components/ui/Sticker";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  /** Big mono code ("404", "500", "oops"). Decorative: the title carries the meaning. */
  code: string;
  title: string;
  description: string;
  /** Short handwritten aside. */
  note?: string;
  /** Corner sticker text. */
  sticker?: string;
  color?: TileColor;
  /** Pick one that contrasts with `color`. */
  stickerColor?: TileColor;
  /** Usually one or two <Button>s. */
  actions: ReactNode;
  /** Draws the underline in (needs MotionProvider, so off in global-error). */
  animated?: boolean;
  className?: string;
}

/**
 * Full-page error / not-found message. Shared by not-found.tsx, error.tsx and global-error.tsx.
 * Server-safe (no hooks), so client error boundaries can render it too.
 */
export function ErrorState({
  code,
  title,
  description,
  note,
  sticker = "Error",
  color = "yellow",
  stickerColor = "coral",
  actions,
  animated = true,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-1 items-center dot-grid py-16 md:py-24", className)}>
      <Container className="flex justify-center">
        <Card
          color={color}
          tilt="left"
          shadow="lg"
          padding="lg"
          sticker={
            <Sticker color={stickerColor} rotate="6">
              {sticker}
            </Sticker>
          }
          className="flex w-full max-w-xl flex-col items-start gap-4"
        >
          <p
            aria-hidden="true"
            className="relative font-mono text-h1 leading-none font-bold tracking-tight"
          >
            {code}
            <Underline
              draw={animated}
              className="absolute -bottom-3 left-0 h-3 w-full text-primary"
            />
          </p>
          <h1 className="mt-2 text-h2 font-bold tracking-tight">{title}</h1>
          <p className="max-w-prose">{description}</p>
          {note && <HandNote tone="ink">{note}</HandNote>}
          <div className="mt-2 flex flex-wrap gap-3">{actions}</div>
        </Card>
      </Container>
    </div>
  );
}
