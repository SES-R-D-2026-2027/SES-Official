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
        xl: "size-24 text-2xl md:size-28",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const imageSizes = { sm: "32px", md: "44px", lg: "64px", xl: "112px" } as const;

export interface AvatarPerson {
  name: string;
  /** Photo; without one the `fallback` is shown. */
  src?: string;
  /** Alt text for the photo (defaults to the name). */
  alt?: string;
  color?: TileColor;
}

export type AvatarProps = AvatarPerson &
  VariantProps<typeof avatarVariants> & {
    /** What to show without a photo: the person's initials or a head-and-shoulders silhouette. */
    fallback?: "initials" | "silhouette";
    className?: string;
  };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Generic "no photo yet" figure in the current text color. */
function Silhouette() {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" className="absolute inset-0 size-full">
      <circle cx="32" cy="25" r="12" className="fill-current" />
      <path d="M8 64 C8 46 19 39 32 39 C45 39 56 46 56 64 Z" className="fill-current" />
    </svg>
  );
}

/** Round photo, initials or silhouette on a tile color. */
export function Avatar({
  name,
  src,
  alt,
  color = "mint",
  size,
  fallback = "initials",
  className,
}: AvatarProps) {
  const sizeKey = size ?? "md";
  return (
    <span className={cn(avatarVariants({ size }), tileColor({ color }), className)}>
      {src ? (
        <Image
          src={src}
          alt={alt ?? name}
          fill
          sizes={imageSizes[sizeKey]}
          className="object-cover"
        />
      ) : fallback === "silhouette" ? (
        <span role="img" aria-label={name} className="absolute inset-0">
          <Silhouette />
        </span>
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
