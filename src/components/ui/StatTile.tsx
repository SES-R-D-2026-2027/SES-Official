import { CountUp } from "@/components/motion/CountUp";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { HandNote } from "./HandNote";
import { Tag } from "./Tag";

export interface StatTileProps {
  value: number;
  /** e.g. "+" for "300+" */
  suffix?: string;
  label: string;
  description?: string;
  color?: TileColor;
  /** Handwritten aside ("all active!"). */
  note?: string;
  className?: string;
}

/** Big counting number + mono label + one-line description (homepage stats row). */
export function StatTile({
  value,
  suffix,
  label,
  description,
  color = "yellow",
  note,
  className,
}: StatTileProps) {
  return (
    <Card color={color} className={cn("flex h-full flex-col gap-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
        <p className="font-display text-5xl leading-none font-bold">
          <CountUp to={value} suffix={suffix} />
        </p>
        {note && <HandNote tone="ink">{note}</HandNote>}
      </div>
      <Tag color="paper" className="self-start whitespace-normal">
        {label}
      </Tag>
      {description && <p className="text-sm">{description}</p>}
    </Card>
  );
}
