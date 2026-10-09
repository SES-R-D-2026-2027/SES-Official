import { Camera } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { tilt, type Tilt } from "./variants";

export interface PolaroidProps {
  /** Omit to show a clearly-marked photo placeholder. */
  image?: { src: string; alt: string };
  /** Short handwritten caption (max ~6 words). */
  caption: string;
  tilt?: Tilt;
  /** next/image `sizes` for the photo. */
  sizes?: string;
  className?: string;
}

/** Photo in a white frame with a thick bottom margin and a Caveat caption. */
export function Polaroid({
  image,
  caption,
  tilt: tiltValue = "left",
  sizes = "(min-width: 768px) 320px, 80vw",
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cn(
        "brutal bg-surface p-3 pb-4",
        tilt({ tilt: tiltValue }),
        tiltValue !== "none" && "straighten",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-brutal-sm bg-tile-blue border-brutal">
        {image ? (
          <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
        ) : (
          <div
            role="img"
            aria-label="Photo placeholder"
            className="flex size-full flex-col items-center justify-center gap-2 dot-grid text-ink"
          >
            <Camera aria-hidden="true" className="size-8" />
            <span className="font-mono text-xs font-medium tracking-widest uppercase">
              Photo soon
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-center font-hand text-2xl leading-tight font-semibold text-ink">
        {caption}
      </figcaption>
    </figure>
  );
}
