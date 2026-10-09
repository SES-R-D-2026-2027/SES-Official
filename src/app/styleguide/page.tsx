import { CalendarDays, Sparkles } from "lucide-react";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoTile } from "@/components/bento/BentoTile";
import { CountUp } from "@/components/motion/CountUp";
import { Draggable } from "@/components/motion/Draggable";
import { FlipCard } from "@/components/motion/FlipCard";
import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Tilt } from "@/components/motion/Tilt";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Doodle } from "@/components/ui/Doodle";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { HandNote } from "@/components/ui/HandNote";
import { Highlight } from "@/components/ui/Highlight";
import { Polaroid } from "@/components/ui/Polaroid";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatTile } from "@/components/ui/StatTile";
import { Sticker } from "@/components/ui/Sticker";
import { Tag } from "@/components/ui/Tag";
import { tileColors } from "@/components/ui/variants";
import { features } from "@/config/features";
import { buildMetadata } from "@/lib/seo";

// Living design reference: every primitive, tile color and motion component.
// All copy below is sample text for the styleguide only, not site content.

export const metadata = buildMetadata({
  title: "Styleguide",
  description: "Living reference of the SES design system: primitives, colors and motion.",
  path: "/styleguide",
  noIndex: true,
});

const semanticColors = [
  { token: "bg", className: "bg-bg text-ink" },
  { token: "surface", className: "bg-surface text-ink" },
  { token: "ink", className: "bg-ink text-surface" },
  { token: "primary", className: "bg-primary text-on-primary" },
  { token: "accent", className: "bg-accent text-on-accent" },
  { token: "highlight", className: "bg-highlight text-ink" },
];

const samplePeople = [
  { name: "Sample One", color: "yellow" as const },
  { name: "Sample Two", color: "mint" as const },
  { name: "Sample Three", color: "lilac" as const },
  { name: "Sample Four", color: "coral" as const },
  { name: "Sample Five", color: "sky" as const },
  { name: "Sample Six", color: "blue" as const },
  { name: "Sample Seven", color: "yellow" as const },
];

const sampleOptions = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" },
];

const tickerItems = ["TypeScript", "Rust", "Python", "Go", "React", "Postgres", "Linux", "Docker"];

/** Mono caption above each specimen. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs font-medium tracking-widest text-muted uppercase">{children}</p>
  );
}

function Specimen({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <Section background="dots" className="border-b-brutal">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <Tag color="yellow">Living design reference</Tag>
            <HandNote arrow="down">not in the sitemap!</HandNote>
          </div>
          <h1 className="text-h1 font-bold tracking-tight">
            The SES{" "}
            <span className="relative inline-block text-link">
              styleguide.
              <Doodle.Underline draw className="absolute -bottom-2 left-0 h-3 w-full" />
            </span>
          </h1>
          <Highlight className="max-w-2xl">
            Every primitive, tile color and motion component, with the props that drive it. Tokens
            live in <code className="font-mono text-sm">src/styles/tokens.css</code>; change them
            there and this page follows.
          </Highlight>
        </div>
      </Section>

      {/* ───── Colors ───── */}
      <Section labelledBy="sg-colors">
        <SectionHeading
          id="sg-colors"
          title="Colors"
          tags={[{ label: "Tokens", color: "mint" }]}
          description="Tile colors come from the `color` prop (ui/variants.ts). Text on every tile is ink."
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {tileColors.map((color) => (
            <li key={color}>
              <Card color={color} padding="sm" className="flex h-28 flex-col justify-end">
                <span className="font-mono text-xs font-medium tracking-widest uppercase">
                  tile-{color}
                </span>
              </Card>
            </li>
          ))}
        </ul>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {semanticColors.map((c) => (
            <li key={c.token} className={`brutal p-4 font-mono text-sm ${c.className}`}>
              {c.token}
            </li>
          ))}
        </ul>
      </Section>

      {/* ───── Typography ───── */}
      <Section labelledBy="sg-type" background="surface" divider>
        <SectionHeading
          id="sg-type"
          title="Typography"
          tags={[{ label: "Fonts", color: "lilac" }]}
        />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Specimen label="text-h1 · Space Grotesk 700">
            <p className="font-display text-h1 font-bold">Built together</p>
          </Specimen>
          <Specimen label="text-h2 / text-h3">
            <p className="font-display text-h2 font-bold">Upcoming events</p>
            <p className="mt-2 font-display text-h3 font-semibold">Workshop: compilers 101</p>
          </Specimen>
          <Specimen label="body · Inter 400">
            <p className="max-w-prose">
              Students build real-world software, compilers, distributed systems and AI. This is
              body text at the default size.
            </p>
            <p className="mt-2 text-muted">Muted body text for secondary information.</p>
          </Specimen>
          <Specimen label="mono label · hand note">
            <p className="font-mono text-xs font-medium tracking-widest uppercase">
              Open registration · 08 Nov
            </p>
            <p className="mt-3 font-hand text-2xl font-semibold">
              start here! no experience needed
            </p>
          </Specimen>
        </div>
      </Section>

      {/* ───── Buttons ───── */}
      <Section labelledBy="sg-buttons" divider>
        <SectionHeading
          id="sg-buttons"
          title="Buttons"
          tags={[{ label: "Primitives", color: "yellow" }]}
          description="Hover lifts, click presses into the shadow. Links styled as buttons take `href`; `external` opens a new tab."
        />
        <div className="mt-10 flex flex-col gap-8">
          <Specimen label="variant: primary · accent · mint · ghost">
            <div className="flex flex-wrap gap-4">
              <Button arrow>Primary</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="mint">Mint</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Specimen>
          <Specimen label="size: sm · md · lg">
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" arrow>
                Small
              </Button>
              <Button size="md" arrow>
                Medium
              </Button>
              <Button size="lg" arrow>
                Large
              </Button>
            </div>
          </Specimen>
          <Specimen label="link · external link · icon · disabled">
            <div className="flex flex-wrap items-center gap-4">
              <Button href="/styleguide#sg-buttons" variant="ghost" arrow>
                Internal link
              </Button>
              <Button href="https://example.com" external variant="mint">
                External link
              </Button>
              <Button
                variant="accent"
                icon={<CalendarDays aria-hidden="true" className="size-4" />}
              >
                With icon
              </Button>
              <Button disabled>Disabled</Button>
            </div>
          </Specimen>
        </div>
      </Section>

      {/* ───── Tags, stickers, notes ───── */}
      <Section labelledBy="sg-labels" background="surface" divider>
        <SectionHeading
          id="sg-labels"
          title="Tags, stickers & notes"
          tags={[{ label: "Primitives", color: "yellow" }]}
        />
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <Specimen label="Tag · every color">
            <div className="flex flex-wrap gap-2">
              {tileColors.map((color) => (
                <Tag key={color} color={color}>
                  {color}
                </Tag>
              ))}
            </div>
          </Specimen>
          <Specimen label="Sticker · rotate · hexagon (decorative)">
            <div className="flex flex-wrap items-center gap-6 py-2">
              <Sticker rotate="-6">New</Sticker>
              <Sticker color="yellow" rotate="3">
                Limited seats
              </Sticker>
              <Sticker color="mint" rotate="6">
                Free pizza
              </Sticker>
              <Sticker shape="hexagon" color="lilac">
                SES
              </Sticker>
              <Sticker shape="hexagon" color="yellow" rotate="6" />
            </div>
          </Specimen>
          <Specimen label="HandNote · tone · arrow">
            <div className="flex flex-col items-start gap-3">
              <HandNote arrow="right">start here!</HandNote>
              <HandNote tone="primary" arrow="left">
                no experience needed
              </HandNote>
              <HandNote tone="ink" arrow="down">
                we don&apos;t bite!
              </HandNote>
            </div>
          </Specimen>
          <Specimen label="Highlight">
            <Highlight>
              A paragraph in a pale-yellow bordered block, as in the hero intro.
            </Highlight>
          </Specimen>
        </div>
      </Section>

      {/* ───── Doodles ───── */}
      <Section labelledBy="sg-doodles" divider>
        <SectionHeading
          id="sg-doodles"
          title="Doodles"
          tags={[{ label: "SVG", color: "sky" }]}
          description="Top row is static; bottom row draws in when scrolled into view (static under reduced motion)."
        />
        <div className="mt-10 flex flex-col gap-8">
          {[false, true].map((draw) => (
            <Specimen key={String(draw)} label={draw ? "draw" : "static"}>
              <div className="grid grid-cols-2 items-center gap-8 text-link sm:grid-cols-5">
                <Doodle.Underline draw={draw} className="h-5 w-full" />
                <Doodle.Circle draw={draw} className="h-14 w-full" />
                <Doodle.Arrow draw={draw} className="h-12 w-20" />
                <Doodle.Star draw={draw} className="size-12 text-primary" />
                <Doodle.Squiggle draw={draw} className="h-5 w-full text-ink" />
              </div>
            </Specimen>
          ))}
        </div>
      </Section>

      {/* ───── Cards, polaroids, stats ───── */}
      <Section labelledBy="sg-cards" background="surface" divider>
        <SectionHeading
          id="sg-cards"
          title="Cards, polaroids & stats"
          tags={[{ label: "Primitives", color: "yellow" }]}
        />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <Card color="mint">
            <Label>Card · color mint</Label>
            <p className="mt-2">The standard bordered box with a hard shadow.</p>
          </Card>
          <Card color="lilac" tilt="left" sticker={<Sticker color="coral">New</Sticker>}>
            <Label>tilt left · sticker</Label>
            <p className="mt-2">Tilted cards straighten on hover or focus inside.</p>
          </Card>
          <Card color="paper" shadow="lg" tilt="right">
            <Label>shadow lg · tilt right</Label>
            <p className="mt-2">For featured content.</p>
          </Card>
        </div>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <Polaroid caption="photo coming soon" />
          <Polaroid caption="right tilt, same frame" tilt="right" />
          <div className="flex flex-col gap-4">
            <Label>Avatar · AvatarStack</Label>
            <div className="flex items-center gap-3">
              <Avatar name="Sample One" size="sm" color="yellow" />
              <Avatar name="Sample Two" color="coral" />
              <Avatar name="Sample Three" size="lg" color="sky" />
            </div>
            <AvatarStack people={samplePeople} max={5} />
          </div>
        </div>
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <StatTile
              value={12}
              label="Sample stat"
              description="Counts up once when visible."
              color="yellow"
              note="all active!"
            />
          </li>
          <li>
            <StatTile
              value={40}
              suffix="+"
              label="Sample stat"
              description="With a suffix."
              color="mint"
            />
          </li>
          <li>
            <StatTile value={25} label="Sample stat" description="Lilac tile." color="lilac" />
          </li>
          <li>
            <StatTile
              value={300}
              suffix="+"
              label="Sample stat"
              description="Coral tile."
              color="coral"
              note="join us!"
            />
          </li>
        </ul>
      </Section>

      {/* ───── Form fields ───── */}
      <Section labelledBy="sg-forms" divider>
        <SectionHeading
          id="sg-forms"
          title="Form fields"
          tags={[{ label: "Primitives", color: "yellow" }]}
          description="Every control has a visible label; hints and errors are linked with aria-describedby."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input label="Name" name="sg-name" placeholder="Your name" required autoComplete="off" />
          <Input
            label="Email"
            name="sg-email"
            type="email"
            defaultValue="not-an-email"
            hint="We only use it to reply."
            error="Enter a valid email address."
            autoComplete="off"
          />
          <Select
            label="Department"
            name="sg-dept"
            placeholder="Choose one…"
            options={sampleOptions}
          />
          <Textarea
            label="Message"
            name="sg-message"
            placeholder="Tell us about your idea"
            rows={3}
          />
        </div>
      </Section>

      {/* ───── Bento ───── */}
      <Section labelledBy="sg-bento" background="surface" divider>
        <SectionHeading
          id="sg-bento"
          title="Bento grid"
          tags={[{ label: "Layout", color: "sky" }]}
          note="tiles pop in!"
          description="Sizes 1x1 · 2x1 · 1x2 · 2x2. One column on mobile, two on tablet, four on desktop."
        />
        <BentoGrid className="mt-10">
          <BentoTile size="2x2" color="yellow" sticker={<Sticker color="coral">Featured</Sticker>}>
            <Tag color="paper" className="self-start">
              2x2 · yellow
            </Tag>
            <p className="font-display text-h3 font-bold">Featured tile</p>
            <p>
              Spans two columns and two rows from tablet up. Comes first in the DOM, so it leads on
              mobile.
            </p>
          </BentoTile>
          <BentoTile color="mint" href="/styleguide#sg-bento">
            <Tag color="paper" className="self-start">
              1x1 · link
            </Tag>
            <p className="font-display text-h3 font-bold">Clickable tile</p>
            <p className="text-sm">Lifts on hover, presses on click.</p>
          </BentoTile>
          <BentoTile color="lilac" tilt="right">
            <Tag color="paper" className="self-start">
              1x1 · tilt
            </Tag>
            <p className="text-sm">Straightens on hover.</p>
          </BentoTile>
          <BentoTile size="2x1" color="sky">
            <Tag color="paper" className="self-start">
              2x1 · sky
            </Tag>
            <p className="text-sm">Wide tile, e.g. a mini calendar.</p>
          </BentoTile>
          <BentoTile size="1x2" color="coral">
            <Tag color="paper" className="self-start">
              1x2 · coral
            </Tag>
            <p className="text-sm">Tall tile.</p>
          </BentoTile>
          <BentoTile color="blue">
            <Tag color="paper" className="self-start">
              1x1 · blue
            </Tag>
          </BentoTile>
          <BentoTile size="2x1" color="paper" href="https://example.com" external>
            <Tag color="yellow" className="self-start">
              2x1 · external link
            </Tag>
            <p className="text-sm">Opens in a new tab.</p>
          </BentoTile>
        </BentoGrid>
      </Section>

      {/* ───── Motion ───── */}
      <Section labelledBy="sg-motion" divider>
        <SectionHeading
          id="sg-motion"
          title="Motion"
          tags={[{ label: "Motion", color: "coral" }]}
          description="Try it with reduced motion on: nothing moves, everything stays visible and usable."
        />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <Specimen label="Reveal · fadeUp / popIn">
            <div className="grid grid-cols-2 gap-4">
              <Reveal>
                <Card color="yellow" padding="sm">
                  fadeUp
                </Card>
              </Reveal>
              <Reveal preset="popIn">
                <Card color="mint" padding="sm">
                  popIn
                </Card>
              </Reveal>
            </div>
          </Specimen>

          <Specimen label="Stagger / StaggerItem">
            <Stagger as="ul" gap="list" className="grid grid-cols-4 gap-3">
              {(["yellow", "mint", "lilac", "coral"] as const).map((color, index) => (
                <StaggerItem as="li" key={color}>
                  <Card color={color} padding="sm" className="text-center font-display font-bold">
                    {index + 1}
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </Specimen>

          <Specimen label="CountUp">
            <p className="font-display text-5xl font-bold">
              <CountUp to={128} suffix="+" />
            </p>
          </Specimen>

          <Specimen label="DrawPath (inside a doodle)">
            <Doodle.Circle draw className="h-20 w-56 text-link" />
          </Specimen>

          <Specimen
            label={`Draggable (flag draggableStickers: ${features.draggableStickers ? "on" : "off"})`}
          >
            <div className="relative flex h-40 items-center justify-center gap-6 rounded-brutal border-dashed dot-grid border-brutal">
              <Draggable label="Sample sticker" disabled={!features.draggableStickers}>
                <Sticker color="yellow" rotate="-6" className="pointer-events-auto">
                  Drag me
                </Sticker>
              </Draggable>
              <Draggable disabled={!features.draggableStickers}>
                <Sticker shape="hexagon" color="mint">
                  :)
                </Sticker>
              </Draggable>
            </div>
            <p className="mt-2 text-sm text-muted">
              Focus the yellow sticker and use the arrow keys; Esc resets.
            </p>
          </Specimen>

          <Specimen
            label={`FlipCard (flag flipTeamCards: ${features.flipTeamCards ? "on" : "off"})`}
          >
            <FlipCard
              label="sample"
              disabled={!features.flipTeamCards}
              front={
                <Card color="sky" className="flex h-44 flex-col justify-between">
                  <Tag color="paper" className="self-start">
                    Front
                  </Tag>
                  <p className="font-display text-h3 font-bold">Click or press the button</p>
                </Card>
              }
              back={
                <Card color="lilac" className="flex h-44 flex-col justify-between">
                  <Tag color="paper" className="self-start">
                    Back
                  </Tag>
                  <p>The hidden face is inert, so its content can&apos;t be focused.</p>
                </Card>
              }
            />
          </Specimen>

          <Specimen label="Tilt (CSS, straightens on hover / focus)">
            <div className="flex gap-6">
              <Tilt>
                <Card color="coral" padding="sm">
                  left
                </Card>
              </Tilt>
              <Tilt direction="right">
                <Card color="yellow" padding="sm">
                  right
                </Card>
              </Tilt>
            </div>
          </Specimen>

          <Specimen label="PageTransition">
            <p className="text-sm">
              Wraps every page via <code className="font-mono">app/template.tsx</code>. Skipped on
              the first load; navigate to another page and back to see the 8px fade-in.
            </p>
            <Button href="/" variant="ghost" size="sm" arrow className="mt-3">
              Go to home
            </Button>
          </Specimen>

          <Specimen
            label="Marquee (pauses on hover, focus or the button)"
            className="md:col-span-2"
          >
            <Marquee label="Sample tech ticker" className="brutal bg-accent p-3">
              {tickerItems.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase"
                >
                  <Sparkles aria-hidden="true" className="size-4" />
                  {item}
                </span>
              ))}
            </Marquee>
          </Specimen>
        </div>
      </Section>

      {/* ───── Layout ───── */}
      <Section labelledBy="sg-layout" background="surface" divider>
        <SectionHeading
          id="sg-layout"
          title="Layout"
          tags={[{ label: "Layout", color: "sky" }]}
          description="Header, menu, footer and skip link are live on this page: press Tab from the top to see the skip link, open the menu button and close it with Esc."
        />
      </Section>
    </>
  );
}
