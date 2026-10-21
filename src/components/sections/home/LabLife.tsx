import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/Card";
import { HandNote } from "@/components/ui/HandNote";
import { Polaroid } from "@/components/ui/Polaroid";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import type { Tilt } from "@/components/ui/variants";
import type { LabPhoto } from "@/content/home";

export interface LabLifeProps {
  tag: string;
  title: string;
  body: string;
  note: string;
  activities: readonly string[];
  photos: readonly LabPhoto[];
}

const tilts: Tilt[] = ["left", "right", "left", "right"];
const activityColor = ["yellow", "mint", "lilac", "coral", "sky"] as const;

/** "Yes, we touch grass." — polaroids + the people-side of SES. */
export function LabLife({ tag, title, body, note, activities, photos }: LabLifeProps) {
  return (
    <Section labelledBy="lab-title" className="py-8 md:py-12">
      <Reveal>
        <Card padding="lg" className="grid grid-cols-1 items-center gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="flex flex-col items-start gap-4 lg:col-span-2">
            <Tag color="mint">{tag}</Tag>
            <h2 id="lab-title" className="text-h2 font-bold tracking-tight">
              {title}
            </h2>
            <p className="text-muted md:text-lg">{body}</p>
            {activities.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Ways we hang out">
                {activities.map((activity, index) => (
                  <li key={activity}>
                    <Tag color={activityColor[index % activityColor.length]}>{activity}</Tag>
                  </li>
                ))}
              </ul>
            )}
            <HandNote>{note}</HandNote>
          </div>

          {photos.length > 0 && (
            <ul
              tabIndex={0}
              aria-label="Photos from SES"
              className="-mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pt-2 pb-4 focus-ring md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:p-0 lg:col-span-3"
            >
              {photos.map((photo, index) => (
                <li key={photo.caption} className="w-60 shrink-0 snap-center md:w-auto">
                  <Polaroid
                    image={photo.image && { src: photo.image.url, alt: photo.image.alt }}
                    caption={photo.caption}
                    tilt={tilts[index % tilts.length]}
                    sizes="(min-width: 1024px) 200px, (min-width: 768px) 30vw, 240px"
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </Reveal>
    </Section>
  );
}
