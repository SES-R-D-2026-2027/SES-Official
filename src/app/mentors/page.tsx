import { MentorsExplorer } from "@/components/sections/mentors/MentorsExplorer";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getMentors } from "@/lib/data/mentors";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentors & Advisory",
  description:
    "Browse verified faculty, alumni and industry mentors associated with the Software Engineering Society at FAST-NUCES.",
  path: "/mentors",
});

export default async function MentorsPage() {
  const { main, minor } = await getMentors();

  if (main.length === 0 && minor.length === 0) {
    return (
      <Section>
        <Container className="flex min-h-[55vh] flex-col items-start justify-center gap-5">
          <Tag color="yellow">Mentorship directory</Tag>
          <h1 className="text-h1 font-bold tracking-tight">Mentors &amp; advisors</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            Mentor profiles are being verified with the society before publication. This page will
            list confirmed faculty, alumni and industry mentors once their details are approved.
          </p>
        </Container>
      </Section>
    );
  }

  return <MentorsExplorer mainMentors={main} minorMentors={minor} />;
}
