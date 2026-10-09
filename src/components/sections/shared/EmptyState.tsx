import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { HandNote } from "@/components/ui/HandNote";
import { Sticker } from "@/components/ui/Sticker";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Short handwritten aside. */
  note?: string;
  /** Usually a <Button>. */
  action?: ReactNode;
  color?: TileColor;
  /** Heading level that fits the surrounding outline. */
  as?: "h2" | "h3";
  className?: string;
}

/** Friendly placeholder for an empty list (no upcoming events, no announcements…). */
export function EmptyState({
  title,
  description,
  note,
  action,
  color = "paper",
  as: Heading = "h3",
  className,
}: EmptyStateProps) {
  return (
    <Card
      color={color}
      sticker={
        <Sticker color="yellow" rotate="6">
          Nothing yet
        </Sticker>
      }
      className={cn("flex w-full flex-col items-start justify-center gap-3", className)}
    >
      <Heading className="text-h3 font-bold">{title}</Heading>
      {description && <p className="max-w-prose">{description}</p>}
      {note && <HandNote tone="ink">{note}</HandNote>}
      {action}
    </Card>
  );
}
