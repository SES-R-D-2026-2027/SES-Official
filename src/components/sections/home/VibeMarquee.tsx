import { Marquee } from "@/components/motion/Marquee";
import { homeCopy } from "@/content/home";

/** Ticker of SES verbs from Campus Pulse, sitting above the join CTA. */
export function VibeMarquee() {
  return (
    <div className="bg-accent py-3 border-t-brutal border-b-brutal">
      <Marquee label="SES vibes">
        {homeCopy.marquee.map((word) => (
          <span
            key={word}
            className="font-display text-lg font-bold tracking-tight text-ink uppercase"
          >
            {word}
            <span aria-hidden="true" className="ml-8 text-link">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
