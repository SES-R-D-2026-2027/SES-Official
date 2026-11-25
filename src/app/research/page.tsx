import Link from "next/link";
import { ArrowUpRight, BookOpenCheck, BrainCircuit, Code2, FileSearch, FlaskConical, Lightbulb, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { getDepartments } from "@/lib/data/departments";
import { getProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Research & Development",
  description: "Explore the Software Engineering Society's technical learning, research interests, prototyping approach and published development work.",
  path: "/research",
});

const explorationTracks = [
  {
    icon: Code2,
    title: "Software engineering practice",
    description: "Explore application architecture, web and mobile development, software quality, testing, maintainability and collaborative engineering workflows.",
  },
  {
    icon: BrainCircuit,
    title: "Artificial intelligence and data",
    description: "Study practical uses of machine learning, language technologies, data analysis and responsible AI through guided experiments and prototypes.",
  },
  {
    icon: ShieldCheck,
    title: "Systems and security",
    description: "Build understanding of operating systems, networks, cloud infrastructure, secure design and the reliability of software systems.",
  },
  {
    icon: Lightbulb,
    title: "Product ideas and prototypes",
    description: "Turn a problem statement into a small prototype, test assumptions with users, document the result and decide what should happen next.",
  },
];

const process = [
  { title: "Frame a question", description: "Define the problem, context, intended users and the question that needs investigation." },
  { title: "Review existing work", description: "Read relevant documentation, papers, standards and existing implementations before selecting an approach." },
  { title: "Experiment and build", description: "Compare possible approaches, create a prototype and record the tools, assumptions and limitations." },
  { title: "Evaluate and share", description: "Test the result, document what worked, explain what did not, and share reusable outcomes with the community." },
];

export default async function ResearchPage() {
  const [departments, projects] = await Promise.all([getDepartments(), getProjects()]);
  const researchTeam = departments.find((department) => department.id === "dep-dev");
  const activeProjects = projects.filter((project) => project.projectStatus === "in-progress");

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-6">
          <Tag color="lilac" className="self-start">Explore, test, build, document</Tag>
          <div className="max-w-4xl">
            <h1 className="text-h1 font-bold tracking-tight">Research &amp; <span className="text-link">Development.</span></h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
              The Research &amp; Development team supports technical learning and practical problem-solving across SES. The aim is to turn curiosity into structured exploration, experiments, prototypes and useful documentation.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="brutal rounded-brutal bg-tile-yellow p-5">
              <FlaskConical className="size-7" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-bold">Investigate</h2>
              <p className="mt-2 text-sm">Understand the problem before choosing a solution.</p>
            </article>
            <article className="brutal rounded-brutal bg-tile-mint p-5">
              <Code2 className="size-7" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-bold">Prototype</h2>
              <p className="mt-2 text-sm">Test ideas through small, practical implementations.</p>
            </article>
            <article className="brutal rounded-brutal bg-tile-lilac p-5">
              <BookOpenCheck className="size-7" aria-hidden="true" />
              <h2 className="mt-3 font-display text-xl font-bold">Share</h2>
              <p className="mt-2 text-sm">Record findings so other students can build on them.</p>
            </article>
          </div>
        </Container>
      </Section>

      <Section background="surface" divider>
        <Container className="flex flex-col gap-8">
          <SectionHeading
            title="Areas to explore"
            description="These are suggested learning and research tracks for student-led work. They are areas of interest, not claims of completed research output."
            tags={[{ label: "Exploration tracks", color: "sky" }]}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {explorationTracks.map(({ icon: Icon, title, description }) => (
              <article key={title} className="brutal rounded-brutal bg-bg p-6">
                <Icon aria-hidden="true" className="size-8 text-link" />
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section divider>
        <Container className="flex flex-col gap-8">
          <SectionHeading
            title="From question to result"
            description="A repeatable approach helps teams keep research practical, traceable and useful to future contributors."
          />
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((step, index) => (
              <li key={step.title} className="brutal rounded-brutal bg-surface p-5">
                <p className="font-mono text-xs font-bold tracking-widest text-link">STEP 0{index + 1}</p>
                <h3 className="mt-3 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="flex items-start gap-3 rounded-brutal border-brutal bg-tile-sky p-5">
            <FileSearch className="mt-0.5 size-6 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed">Good documentation should include the research question, references, setup instructions, experiment notes, results, limitations and next steps. Unverified results should never be presented as completed achievements.</p>
          </div>
        </Container>
      </Section>

      <Section background="surface" divider>
        <Container className="flex flex-col gap-6">
          <SectionHeading
            title="Published development work"
            description="The project catalogue is the source of truth for the work currently listed by SES. Status is shown as recorded in that catalogue."
          />
          {activeProjects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeProjects.map((project) => (
                <article key={project.id} className="brutal rounded-brutal bg-bg p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag color="mint">In progress</Tag>
                    <Tag color="paper">{project.technologies.length} technologies</Tag>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold">{project.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
                  <p className="mt-4 font-mono text-xs tracking-wide text-muted">{project.technologies.join(" / ")}</p>
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-link underline-offset-4 hover:underline">
                      View repository <ArrowUpRight className="size-4" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-brutal border-brutal bg-bg p-5 text-sm text-muted">No active development project is currently listed in the public catalogue.</p>
          )}
          <p className="text-xs text-muted">This section reflects published project records. It does not imply that every exploration track above has an active project or published result.</p>
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <Tag color="yellow" className="mb-3">Get involved</Tag>
            <h2 className="font-display text-h2 font-bold">Curiosity is a good starting point.</h2>
            <p className="mt-3 max-w-2xl text-muted">Bring a question, propose a prototype, help document an experiment or join a team that is already building.</p>
            {researchTeam && <p className="mt-2 text-sm text-muted">Explore the {researchTeam.name} team page for its roles and responsibilities.</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/departments/research-development" className="inline-flex items-center gap-2 rounded-brutal border-brutal bg-tile-yellow px-4 py-3 font-semibold focus-ring">Research &amp; Development <ArrowUpRight className="size-4" /></Link>
            <Link href="/team" className="inline-flex items-center gap-2 rounded-brutal border-brutal bg-surface px-4 py-3 font-semibold focus-ring">Meet the team <ArrowUpRight className="size-4" /></Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
