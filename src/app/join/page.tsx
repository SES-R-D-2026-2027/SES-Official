import type { Metadata } from "next";
import { ArrowUpRight, ClipboardList, Users } from "lucide-react";
import { JoinApplicationForm } from "@/components/sections/join/JoinApplicationForm";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Join the SES community",
  description: "Introduce yourself and tell the Software Engineering Society at FAST-NUCES Islamabad where you would like to contribute.",
  path: "/join",
});

export default function JoinPage() {
  return (
    <section className="py-10 md:py-16">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 max-w-3xl">
            <Tag color="yellow">Your next step starts here</Tag>
            <h1 className="mt-4 text-h1 font-bold tracking-tight text-ink">Find your place at SES.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
              Have an idea, a skill you want to develop, or simply the curiosity to try something new? Tell us a little about yourself.
            </p>
          </div>

          <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
            <Card color="paper" padding="lg" className="min-w-0">
              <JoinApplicationForm />
            </Card>

            <aside className="flex h-full min-h-full flex-col gap-4">
              <Card color="blue" padding="lg" className="flex-1">
                <span className="mb-4 grid size-12 place-items-center rounded-brutal border-brutal bg-surface text-link">
                  <Users aria-hidden="true" className="size-6" />
                </span>
                <h2 className="font-display text-xl font-bold">There is room to learn and contribute.</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  SES brings students together around software, research, creative work, events, and shared campus experiences.
                </p>
              </Card>
              <Card color="mint" padding="lg" className="flex-1">
                <div className="flex items-center gap-2 font-display font-bold">
                  <ClipboardList aria-hidden="true" className="size-5" />
                  What happens next?
                </div>
                <p className="mt-3 text-sm leading-relaxed">
                  The form is currently a visual prototype. Once the Google Forms or backend connection is ready, this page can submit applications to the team.
                </p>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                  Questions? Email SES
                  <a className="inline-flex items-center gap-1 underline underline-offset-4" href="mailto:ses.isb@nu.edu.pk">
                    Contact us <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </p>
              </Card>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}
