import type { ReactNode } from "react";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";
import { HandNote } from "./HandNote";
import { Tag } from "./Tag";

const headingSize = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
} as const;

export interface SectionHeadingProps {
  /** Pass the same id as the Section's `labelledBy`. */
  id?: string;
  as?: keyof typeof headingSize;
  title: ReactNode;
  description?: ReactNode;
  tags?: { label: string; color?: TileColor }[];
  /** Short handwritten aside next to the tags ("free pizza at all talks!"). */
  note?: string;
  /** Right-aligned action, e.g. <Button>View full calendar</Button>. */
  action?: ReactNode;
  className?: string;
}

/** Tag row + heading + intro + optional action, as used at the top of every section. */
export function SectionHeading({
  id,
  as: Heading = "h2",
  title,
  description,
  tags,
  note,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn("flex flex-col gap-5 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="flex max-w-2xl flex-col gap-3">
        {(tags?.length || note) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {tags?.map((tag) => (
              <Tag key={tag.label} color={tag.color}>
                {tag.label}
              </Tag>
            ))}
            {note && <HandNote>{note}</HandNote>}
          </div>
        )}
        <Heading id={id} className={cn("font-bold tracking-tight text-ink", headingSize[Heading])}>
          {title}
        </Heading>
        {description && <p className="text-base text-muted md:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
