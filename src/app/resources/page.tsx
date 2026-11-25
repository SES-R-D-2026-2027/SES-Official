import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined, Handshake, Mail, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tag } from "@/components/ui/Tag";
import { getDepartments } from "@/lib/data/departments";
import { getProjects } from "@/lib/data/projects";
import { getTeam } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Resources & Partnerships",
  description: "SES partnership information, sponsorship enquiries and transparent society activity metrics.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const [departments, team, projects] = await Promise.all([getDepartments(), getTeam(), getProjects()]);
  const completed = projects.filter((project) => project.projectStatus === "shipped" || project.projectStatus === "maintained").length;
  const active = projects.filter((project) => project.projectStatus === "in-progress").length;
  const officerCount = new Set(team.map((member) => member.id)).size;
  const leadership = team.filter((member) => member.role === "leadership").length;
  const departmentLeads = team.filter((member) => member.role === "head").length;

  const metrics = [
    { value: String(departments.length), label: "Functional teams", note: "Current published department directory" },
    { value: String(leadership), label: "Leadership & advisor roles", note: "Current executive and advisor records" },
    { value: String(departmentLeads), label: "Department leads & co-leads", note: "Current published department leadership records" },
    { value: String(officerCount), label: "Total officers", note: "Every published role holder counts as an officer, regardless of title" },
    { value: String(projects.length), label: "Listed projects", note: "Projects currently in the website catalogue" },
    { value: String(completed), label: "Completed projects", note: "Marked shipped or maintained in the catalogue" },
    { value: String(active), label: "In-progress projects", note: "Currently marked in progress" },
    { value: "Not published", label: "Verified mentors", note: "Mentor roster requires confirmation before a count is shown" },
  ];

  return (
    <>
      <Section>
        <Container className="flex flex-col gap-6">
          <Tag color="yellow" className="self-start">Resources & partnerships</Tag>
          <div className="max-w-4xl">
            <h1 className="text-h1 font-bold tracking-tight">Good work grows through <span className="text-link">good partnerships.</span></h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">This page is the starting point for sponsor information, collaboration opportunities and a transparent snapshot of the society’s published activity.</p>
          </div>
        </Container>
      </Section>

      <Section background="surface" divider>
        <Container className="flex flex-col gap-8">
          <SectionHeading title="Sponsors & collaborators" description="We welcome organizations that want to support student learning, practical projects, events and meaningful campus engagement." />
          <div className="grid gap-5 md:grid-cols-2">
            <article className="brutal rounded-brutal bg-bg p-6">
              <Handshake className="mx-auto block size-8 text-link" aria-hidden="true" />
              <Tag color="mint" className="mt-4">Publicly documented collaboration</Tag>
              <h2 className="mt-3 font-display text-2xl font-bold">Canva Student Community at FAST NUCES Islamabad</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">SES’s public LinkedIn profile has documented a collaboration with the Canva Student Community at FAST NUCES Islamabad. This is listed as a collaboration, not represented as a paid sponsorship.</p>
              <a href="https://pk.linkedin.com/company/nuses" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-link underline-offset-4 hover:underline">See public collaboration update <ArrowUpRight className="size-4" /></a>
            </article>
            <article className="brutal rounded-brutal bg-tile-yellow p-6">
              <h2 className="font-display text-2xl font-bold">Become an SES partner</h2>
              <p className="mt-2 text-sm leading-relaxed">Interested in sponsoring an event, supporting a workshop, mentoring a project team or collaborating with students?</p>
              <a href="mailto:ses.isb@nu.edu.pk?subject=SES%20Partnership%20Enquiry" className="mt-5 inline-flex items-center gap-2 font-semibold underline underline-offset-4"><Mail className="size-4" /> Contact the society</a>
            </article>
          </div>
          <p className="text-xs text-muted">No additional sponsor names are published here until the relationship and approved brand details are confirmed by SES.</p>
        </Container>
      </Section>

      <Section divider>
        <Container className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="grid size-12 place-items-center rounded-full border-brutal bg-highlight">
              <ChartNoAxesCombined className="block size-7 text-link" aria-hidden="true" />
            </span>
            <SectionHeading
              title="Society snapshot"
              description="Live totals derived from the website’s current public content records. These are directory and project-catalogue counts, not audited university-wide statistics."
              className="items-center text-center md:flex-col md:items-center"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => <article key={metric.label} className="brutal rounded-brutal bg-surface p-5"><p className="font-display text-3xl font-bold">{metric.value}</p><h3 className="mt-2 font-semibold">{metric.label}</h3><p className="mt-1 text-xs leading-relaxed text-muted">{metric.note}</p></article>)}
          </div>
          <div className="rounded-brutal border-brutal bg-surface p-5">
            <div className="flex items-center gap-2 font-semibold"><span className="grid size-6 shrink-0 place-items-center"><ShieldCheck className="size-5 text-link" /></span> Measurement and verification</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
              <li>Completed projects are counted only when their catalogue status is “shipped” or “maintained”.</li>
              <li>Total officers counts every unique person in the published team directory, including the president, vice presidents, advisor, leads and co-leads.</li>
              <li>Leadership and department-lead figures are role breakdowns within the total officer count, not additional people to be added to it.</li>
              <li>The officer total reflects the current public team dataset; it is not a count of every society member or volunteer.</li>
              <li>Mentor totals are withheld until a verified mentor roster is supplied.</li>
              <li>Website visits, unique visitors and engagement analytics are not displayed because no analytics provider is configured in this source package.</li>
              <li>Claims that SES is the largest society on campus need an official comparative source before a numerical ranking is published.</li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-link underline-offset-4 hover:underline">Explore projects <ArrowUpRight className="size-4" /></Link>
            <Link href="/team" className="inline-flex items-center gap-2 text-sm font-semibold text-link underline-offset-4 hover:underline">Explore the team <ArrowUpRight className="size-4" /></Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
