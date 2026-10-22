import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import type { TeamMember, TileColor } from "@/types/content";

export interface OfficersGridProps {
  officers: TeamMember[];
}

const colors: TileColor[] = ["yellow", "mint", "lilac", "sky"];

/** The society's officers as large cards (1 column on mobile, 3 on desktop). */
export function OfficersGrid({ officers }: OfficersGridProps) {
  if (officers.length === 0) return null;
  return (
    <Section labelledBy="officers-title">
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="officers-title"
          title="Officers"
          description="They steer the society, connect the departments and speak for SES on and off campus."
          tags={[{ label: "Executive council", color: "coral" }]}
          note="the buck stops here"
        />
        <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {officers.map((officer, i) => (
            <StaggerItem as="li" key={officer.id} className="flex">
              <Card
                as="article"
                color={colors[i % colors.length]}
                tilt={i === 1 ? "right" : "none"}
                shadow="lg"
                className="flex w-full flex-col items-center gap-4 text-center"
              >
                <Avatar
                  name={officer.name}
                  src={officer.photo?.url}
                  alt={officer.photo?.alt}
                  fallback="silhouette"
                  color="paper"
                  size="xl"
                />
                <h3 className="font-display text-2xl font-bold">{officer.name}</h3>
                <Tag color="paper" className="whitespace-normal">
                  {officer.position}
                </Tag>
                {officer.bio && <p className="text-sm">{officer.bio}</p>}
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
