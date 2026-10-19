import { FlipCard } from "@/components/motion/FlipCard";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { HandNote } from "@/components/ui/HandNote";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { tileColors } from "@/components/ui/variants";
import { isEnabled } from "@/config/features";
import { siteConfig } from "@/config/site";
import { homeCopy } from "@/content/home";
import type { TeamMember, TileColor } from "@/types/content";

export interface TeamStripProps {
  members: TeamMember[];
}

const copy = homeCopy.team;
const colors = tileColors.filter((c) => c !== "paper") as TileColor[];

/** Leadership teaser from Campus Pulse, rendered as flip cards. */
export function TeamStrip({ members }: TeamStripProps) {
  const leads = members.filter((m) => m.role === "leadership").slice(0, 4);
  const flip = isEnabled("flipTeamCards");

  return (
    <Section id="team" labelledBy="team-title" background="surface" divider>
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="team-title"
          title={copy.title}
          description={copy.description}
          tags={[{ label: copy.tag, color: "sky" }]}
          action={
            <Button href="/team" variant="ghost" size="sm" arrow>
              Meet everyone
            </Button>
          }
        />

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {leads.map((member, index) => {
            const color = colors[index % colors.length];
            const front = (
              <Card color={color} className="flex h-full min-h-56 flex-col gap-4">
                <Avatar
                  name={member.name}
                  src={member.photo?.url}
                  color="paper"
                  size="lg"
                />
                <div className="mt-auto flex flex-col gap-1">
                  <h3 className="font-display text-xl font-bold">{member.name}</h3>
                  <p className="text-sm">{member.position}</p>
                </div>
              </Card>
            );
            const back = (
              <Card color={color} className="flex h-full min-h-56 flex-col justify-between gap-4">
                <p className="font-display text-lg font-bold">{member.name}</p>
                <p className="text-sm">{member.funFact ?? member.bio ?? member.position}</p>
                <HandNote tone="ink">could be you</HandNote>
              </Card>
            );

            return (
              <StaggerItem key={member.id}>
                <FlipCard label={member.name} front={front} back={back} disabled={!flip} />
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="flex justify-center">
          <Button href={siteConfig.cta.href} variant="accent" arrow>
            {copy.joinLabel}
          </Button>
        </div>
      </div>
    </Section>
  );
}
