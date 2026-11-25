import Link from "next/link";
import { ArrowUpRight, Code2, Compass, Lightbulb, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { getDepartments } from "@/lib/data/departments";
import { getProjects } from "@/lib/data/projects";
import { getTeam } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About SES",
  description: "Learn about the Software Engineering Society at FAST-NUCES Islamabad, its purpose, teams and community.",
  path: "/about",
});

const pillars = [
  { icon: Code2, title: "Build practical skills", body: "Create opportunities to learn software engineering through projects, workshops and hands-on activities." },
  { icon: Compass, title: "Explore career paths", body: "Help students discover different domains of software engineering and understand the skills used in industry." },
  { icon: Users, title: "Grow through community", body: "Connect students, faculty, alumni and industry professionals through shared learning and campus activities." },
  { icon: Lightbulb, title: "Turn ideas into action", body: "Give student ideas a place to become initiatives, events, collaborations and working projects." },
];

export default async function AboutPage() {
  const [departments, team, projects] = await Promise.all([getDepartments(), getTeam(), getProjects()]);
  const shipped = projects.filter((project) => project.projectStatus === "shipped" || project.projectStatus === "maintained").length;

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-8">
          <Tag color="yellow" className="self-start">About the society</Tag>
          <div className="max-w-4xl">
            <h1 className="text-h1 font-bold tracking-tight">Engineering a stronger <span className="text-link">student community.</span></h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">The Software Engineering Society (SES) is the official society associated with the Software Engineering department at FAST-NUCES, Islamabad. Its purpose is to help students advance their careers across software engineering domains and engage with the wider campus through extracurricular activities.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="brutal rounded-brutal bg-tile-yellow p-5"><p className="font-mono text-xs uppercase tracking-widest">Established</p><p className="mt-2 font-display text-3xl font-bold">2022</p><p className="mt-1 text-sm">Public LinkedIn profile listing</p></div>
            <div className="brutal rounded-brutal bg-tile-mint p-5"><p className="font-mono text-xs uppercase tracking-widest">Campus</p><p className="mt-2 font-display text-3xl font-bold">Islamabad</p><p className="mt-1 text-sm">FAST-NUCES</p></div>
            <div className="brutal rounded-brutal bg-tile-lilac p-5"><p className="font-mono text-xs uppercase tracking-widest">Current structure</p><p className="mt-2 font-display text-3xl font-bold">{departments.length} teams</p><p className="mt-1 text-sm">Across society operations</p></div>
          </div>
          <p className="text-xs text-muted">The establishment year is taken from SES’s public LinkedIn organization profile; current team and project figures are calculated from this website’s published records.</p>
        </Container>
      </Section>

      <Section background="surface" divider>
        <Container className="flex flex-col gap-8">
          <SectionHeading title="Why SES exists" description="A student-led space to learn beyond the classroom, build with others and connect academic foundations with practical work." />
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, title, body }) => <article key={title} className="brutal rounded-brutal bg-bg p-6"><Icon aria-hidden="true" className="size-7 text-link" /><h2 className="mt-4 font-display text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></article>)}
          </div>
        </Container>
      </Section>

      <Section divider>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading title="How we work" description="Nine functional teams contribute to the planning, communication, delivery and documentation behind society activities." />
            <Link href="/team" className="mt-5 inline-flex items-center gap-2 font-semibold text-link underline-offset-4 hover:underline">Meet the team <ArrowUpRight className="size-4" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="brutal rounded-brutal bg-tile-sky p-5"><p className="font-display text-3xl font-bold">{team.length}</p><p className="mt-1 text-sm">People listed in the current team directory</p></div>
            <div className="brutal rounded-brutal bg-tile-mint p-5"><p className="font-display text-3xl font-bold">{projects.length}</p><p className="mt-1 text-sm">Project currently listed</p></div>
            <div className="brutal rounded-brutal bg-tile-lilac p-5"><p className="font-display text-3xl font-bold">{shipped}</p><p className="mt-1 text-sm">Projects marked completed</p></div>
            <div className="brutal rounded-brutal bg-tile-yellow p-5"><p className="font-display text-3xl font-bold">{departments.length}</p><p className="mt-1 text-sm">Functional teams</p></div>
          </div>
        </Container>
      </Section>

      <Section background="surface">
        <Container className="flex flex-col gap-4">
          <SectionHeading title="A community that shows up" description="SES activities span technical learning, competitions, creative work, networking and campus-wide experiences." />
          <div className="brutal rounded-brutal bg-bg p-6">
            <Tag color="coral" className="mb-3">Publicly documented highlight</Tag>
            <h2 className="font-display text-2xl font-bold">SOVENTURE 2025</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">SES’s public LinkedIn update describes SOVENTURE 2025 as a major Fall event featuring 30+ stalls, 15 competitions and 1,200+ participants from Islamabad and Rawalpindi, alongside technical, business, esports and cultural activities. The same post reports a PKR 200,000 prize pool.</p>
            <a href="https://pk.linkedin.com/company/nuses" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-link underline-offset-4 hover:underline">View SES public updates <ArrowUpRight className="size-4" /></a>
          </div>
        </Container>
      </Section>
    </>
  );
}
