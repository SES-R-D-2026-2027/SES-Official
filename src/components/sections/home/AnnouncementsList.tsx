import { Pin } from "lucide-react";
import { Draggable } from "@/components/motion/Draggable";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EmptyState } from "@/components/sections/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Star, Squiggle } from "@/components/ui/Doodle";
import { HandNote } from "@/components/ui/HandNote";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { isEnabled } from "@/config/features";
import { homeCopy } from "@/content/home";
import type { Announcement, AnnouncementCategory, TileColor } from "@/types/content";
import { formatDate } from "@/lib/utils";

export interface AnnouncementsListProps {
  /** Newest first. */
  announcements: Announcement[];
}

const copy = homeCopy.announcements;

const categoryColor: Record<AnnouncementCategory, TileColor> = {
  news: "mint",
  research: "lilac",
  partnership: "sky",
  community: "coral",
  notice: "yellow",
};

/**
 * Latest announcements (DESIGN.md §6.7): list on the left; the right side holds the pinned
 * announcement and a sticker cluster, so the card never has an empty half.
 */
export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  const pinned = announcements.find((a) => a.isPinned);
  const list = announcements.filter((a) => a !== pinned).slice(0, 3);
  const draggable = isEnabled("draggableStickers");

  return (
    <Section id="announcements" labelledBy="announcements-title">
      <Card padding="lg" className="flex flex-col gap-8">
        <SectionHeading
          id="announcements-title"
          title={copy.title}
          description={copy.description}
          tags={[{ label: copy.tag, color: "coral" }]}
          action={
            <Button href="/announcements" variant="ghost" size="sm" arrow>
              Browse archive
            </Button>
          }
        />

        {announcements.length === 0 ? (
          <EmptyState
            title="No news is good news."
            description="Nothing announced yet this semester. Check back soon."
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <Stagger as="ul" gap="list" className="flex flex-col lg:col-span-2">
              {list.map((item) => (
                <StaggerItem
                  as="li"
                  preset="fadeUp"
                  key={item.id}
                  className="flex flex-col gap-3 py-5 border-t-brutal first:border-t-0 first:pt-0 sm:flex-row sm:items-start sm:gap-5"
                >
                  <div className="flex shrink-0 flex-wrap gap-2 sm:w-32 sm:flex-col sm:items-start">
                    <Tag color="paper">
                      <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
                    </Tag>
                    <Tag color={categoryColor[item.category]}>{item.category}</Tag>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <h3 className="font-display text-lg leading-snug font-bold">{item.title}</h3>
                    <p className="text-sm text-muted">{item.summary}</p>
                  </div>
                  <Button
                    href={`/announcements/${item.slug}`}
                    size="sm"
                    arrow
                    className="self-start"
                  >
                    Read<span className="sr-only">: {item.title}</span>
                  </Button>
                </StaggerItem>
              ))}
            </Stagger>

            <aside aria-label="Pinned" className="relative flex flex-col gap-6 lg:pl-2">
              {pinned && (
                <Card
                  color="yellow"
                  tilt="right"
                  sticker={
                    <Sticker color="coral" rotate="6">
                      Pinned
                    </Sticker>
                  }
                  className="flex flex-col gap-3"
                >
                  <p className="flex items-center gap-1.5 font-mono text-xs font-medium tracking-widest uppercase">
                    <Pin aria-hidden="true" className="size-3.5" />
                    Pinned ·{" "}
                    <time dateTime={pinned.publishedAt}>{formatDate(pinned.publishedAt)}</time>
                  </p>
                  <h3 className="font-display text-lg leading-snug font-bold">{pinned.title}</h3>
                  <p className="text-sm">{pinned.summary}</p>
                  <Button
                    href={`/announcements/${pinned.slug}`}
                    variant="ghost"
                    size="sm"
                    arrow
                    className="self-start"
                  >
                    Read<span className="sr-only">: {pinned.title}</span>
                  </Button>
                </Card>
              )}

              {/* sticker cluster: pure decoration */}
              <div
                aria-hidden="true"
                className="relative hidden min-h-40 flex-1 items-center justify-center gap-4 sm:flex"
              >
                <Star draw className="absolute top-2 left-4 size-10 text-link" />
                <Draggable disabled={!draggable}>
                  <Sticker shape="hexagon" color="mint">
                    New
                  </Sticker>
                </Draggable>
                <Draggable disabled={!draggable}>
                  <Sticker color="lilac" rotate="-6">
                    Fresh dispatch
                  </Sticker>
                </Draggable>
                <Squiggle draw className="absolute right-2 bottom-2 h-5 w-28 text-primary" />
                <HandNote className="absolute bottom-0 left-2">hot off the press!</HandNote>
              </div>
            </aside>
          </div>
        )}
      </Card>
    </Section>
  );
}
