import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { TileColor } from "@/types/content";
import { cn } from "@/lib/utils";
import { tileColor } from "./variants";

const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold border-brutal",
  {
    variants: {
      size: {
        sm: "size-8 text-xs",
        md: "size-11 text-sm",
        lg: "size-16 text-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const imageSizes = { sm: "32px", md: "44px", lg: "64px" } as const;

export interface AvatarPerson {
  name: string;
  /** Photo; without one the initials are shown. */
  src?: string;
  color?: TileColor;
}

export type AvatarProps = AvatarPerson &
  VariantProps<typeof avatarVariants> & { className?: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Round photo or initials on a tile color. */
export function Avatar({ name, src, color = "mint", size, className }: AvatarProps) {
  const sizeKey = size ?? "md";
  return (
    <span className={cn(avatarVariants({ size }), tileColor({ color }), className)}>
      {src ? (
        <Image src={src} alt={name} fill sizes={imageSizes[sizeKey]} className="object-cover" />
      ) : (
        <span role="img" aria-label={name}>
          <span aria-hidden="true">{initials(name)}</span>
        </span>
      )}
    </span>
  );
}

export interface AvatarStackProps {
  people: AvatarPerson[];
  /** How many avatars to show before "+N". */
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

/** Overlapping row of avatars with a "+N" counter. */
export function AvatarStack({ people, max = 5, size, className }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const hidden = people.length - shown.length;
  return (
    <ul className={cn("flex items-center -space-x-3", className)}>
      {shown.map((person) => (
        <li key={person.name}>
          <Avatar {...person} size={size} />
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <span className={cn(avatarVariants({ size }), "bg-surface text-ink")}>
            <span aria-hidden="true">+{hidden}</span>
            <span className="sr-only">and {hidden} more</span>
          </span>
        </li>
      )}
    </ul>
  );
}
