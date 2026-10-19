import { Draggable } from "@/components/motion/Draggable";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { HandNote } from "@/components/ui/HandNote";
import { Section } from "@/components/ui/Section";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { isEnabled } from "@/config/features";
import { siteConfig } from "@/config/site";
import { homeCopy } from "@/content/home";

const copy = homeCopy.join;
const discordUrl = siteConfig.socials.find((s) => s.icon === "discord")?.href;

/** Big coral "Come build with us." block. Heading is ink, not white (contrast fix, DESIGN.md §6.8). */
export function JoinCta() {
  return (
    <Section id="join" labelledBy="join-title">
      <Reveal>
        <div className="relative flex flex-col items-center gap-6 brutal rounded-brutal-lg bg-tile-coral px-5 py-12 text-center text-ink shadow-brutal-lg md:px-12 md:py-16">
          <Draggable
            disabled={!isEnabled("draggableStickers")}
            className="absolute -top-4 left-4 z-10 md:left-8"
          >
            <Sticker color="yellow" rotate="-6">
              {copy.sticker}
            </Sticker>
          </Draggable>

          <Tag color="yellow">{copy.tag}</Tag>
          <h2 id="join-title" className="text-h1 font-bold tracking-tight">
            {copy.title}
          </h2>
          <p className="max-w-xl rounded-brutal bg-surface p-4 font-medium border-brutal md:p-5 md:text-lg">
            {copy.body}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href={siteConfig.cta.href} size="lg" arrow>
              {copy.joinLabel}
            </Button>
            {discordUrl && (
              <Button href={discordUrl} external variant="ghost" size="lg">
                {copy.discordLabel}
              </Button>
            )}
          </div>
          <HandNote tone="ink" arrow="up" className="text-2xl">
            {copy.note}
          </HandNote>
        </div>
      </Reveal>
    </Section>
  );
}
