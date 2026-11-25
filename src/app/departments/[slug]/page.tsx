import { ArrowLeft, ClipboardList, FolderKanban, Image as ImageIcon, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/sections/shared/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { getDepartments } from "@/lib/data/departments";
import { getTeam } from "@/lib/data/team";
import { buildMetadata } from "@/lib/seo";

type DepartmentPageProps = { params: Promise<{ slug: string }> };

async function loadDepartment(slug: string) {
  const [departments, team] = await Promise.all([getDepartments(), getTeam()]);
  const department = departments.find((item) => item.slug === slug);
  if (!department) return null;
  const members = team
    .filter((member) => member.departmentId === department.id)
    .sort((a, b) => a.order - b.order);
  return { department, members };
}

export async function generateStaticParams() {
  const departments = await getDepartments();
  return departments.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadDepartment(slug);
  if (!result) return buildMetadata({ title: "Team not found", noIndex: true });
  return buildMetadata({
    title: result.department.name,
    description: result.department.shortDescription,
    path: `/departments/${result.department.slug}`,
  });
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const result = await loadDepartment(slug);
  if (!result) notFound();

  const { department, members } = result;
  const leaders = members.filter((member) => member.role === "head");
  const contributors = members.filter((member) => member.role === "member");

  return (
    <>
      <Section background="dots" labelledBy="department-title" className="py-10 md:py-16">
        <div className="flex flex-col gap-8">
          <Button
            href="/team"
            variant="ghost"
            size="sm"
            className="self-start"
            icon={<ArrowLeft aria-hidden="true" className="size-4" />}
          >
            All teams
          </Button>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
            <div className="flex flex-col items-start gap-5">
              <Tag color={department.color ?? "paper"}>SES team</Tag>
              <h1 id="department-title" className="text-h1 font-bold tracking-tight">
                {department.name}
              </h1>
              <p className="max-w-3xl text-xl text-muted">{department.shortDescription}</p>
              <p className="max-w-3xl text-base leading-relaxed">{department.description}</p>
            </div>

            <Card color={department.color} className="flex flex-col gap-3">
              <p className="font-mono text-xs font-semibold tracking-widest uppercase">Team snapshot</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="font-display text-3xl font-bold">{leaders.length}</p>
                  <p className="text-sm text-muted">Leads & co-leads</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold">{members.length}</p>
                  <p className="text-sm text-muted">Listed members</p>
                </div>
              </div>
              <p className="text-xs text-muted">2026–27 term roster</p>
            </Card>
          </div>
        </div>
      </Section>

      <Section labelledBy="people-title">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="people-title" className="text-h2 font-bold">People on this team</h2>
            <p className="max-w-2xl text-muted">Meet the current leads, co-leads and listed team members.</p>
          </div>

          {members.length ? (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <li key={member.id}>
                  <Card color={department.color} className="flex h-full items-center gap-4">
                    <Avatar
                      name={member.name}
                      src={member.photo?.url}
                      alt={member.photo?.alt}
                      fallback="silhouette"
                      color="paper"
                      size="xl"
                    />
                    <div className="flex min-w-0 flex-col gap-1">
                      <h3 className="font-display text-lg font-bold">{member.name}</h3>
                      <Tag color="paper" className="self-start">{member.position}</Tag>
                      {member.bio && <p className="text-sm text-muted">{member.bio}</p>}
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="Team roster coming soon" description="The team member list will appear here once it is published." />
          )}
          {contributors.length > 0 && (
            <p className="text-sm text-muted">{contributors.length} additional team members are listed for this department.</p>
          )}
        </div>
      </Section>

      <Section background="surface" divider labelledBy="responsibilities-title">
        <div className="flex flex-col gap-6">
          <h2 id="responsibilities-title" className="text-h2 font-bold">What this team handles</h2>
          <Card color={department.color} className="grid gap-4 sm:grid-cols-2">
            {department.responsibilities.map((responsibility, index) => (
              <div key={`${index}-${responsibility}`} className="flex items-start gap-3">
                <span className="font-mono text-sm font-bold text-muted">{String(index + 1).padStart(2, "0")}</span>
                <p>{responsibility}</p>
              </div>
            ))}
          </Card>
        </div>
      </Section>

      <Section labelledBy="work-title">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="work-title" className="text-h2 font-bold">Team work &amp; activity</h2>
            <p className="max-w-2xl text-muted">Dedicated spaces for the work carried out by this team. These sections are ready for content to be added.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <EmptyState
              title="Activities & events"
              description="Workshops, events, campaigns and other activities will be documented here."
              color="yellow"
              action={<span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"><Sparkles className="size-4" /> Activity archive</span>}
            />
            <EmptyState
              title="Tasks & workflow"
              description="The team's responsibilities, ongoing tasks, workflow and execution notes will live here."
              color="mint"
              action={<span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"><ClipboardList className="size-4" /> Work board</span>}
            />
            <EmptyState
              title="Projects & deliverables"
              description="Completed and active projects, outcomes, and deliverables will be added here."
              color="lilac"
              action={<span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"><FolderKanban className="size-4" /> Project library</span>}
            />
            <EmptyState
              title="Gallery & highlights"
              description="Photos, design work, event highlights and team milestones will appear here."
              color="sky"
              action={<span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"><ImageIcon className="size-4" /> Team gallery</span>}
            />
          </div>
        </div>
      </Section>

      <Section background="surface" divider>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-h3 font-bold">Explore the other teams</h2>
            <p className="text-sm text-muted">Return to the full society roster and choose another department.</p>
          </div>
          <Button href="/team" variant="accent" arrow>
            Browse all teams
          </Button>
        </div>
      </Section>
    </>
  );
}
