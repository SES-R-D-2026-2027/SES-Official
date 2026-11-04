import { MentorsExplorer } from "@/components/sections/mentors/MentorsExplorer";
import { getMentors } from "@/lib/data/mentors";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Mentors & Advisory",
  description:
    "Meet the professors, alumni innovators, and industry mentors guiding the Software Engineering Society at FAST-NUCES.",
  path: "/mentors",
});

export default async function MentorsPage() {
  const { main, minor } = await getMentors();

  return <MentorsExplorer mainMentors={main} minorMentors={minor} />;
}
