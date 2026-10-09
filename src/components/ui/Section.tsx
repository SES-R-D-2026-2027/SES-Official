import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

const sectionVariants = cva("py-16 md:py-24", {
  variants: {
    background: {
      none: "",
      surface: "bg-surface",
      dots: "dot-grid",
    },
    divider: {
      true: "border-t-brutal",
      false: "",
    },
  },
  defaultVariants: { background: "none", divider: false },
});

export type SectionProps = VariantProps<typeof sectionVariants> & {
  id?: string;
  /** id of the heading that names this section (usually the SectionHeading id). */
  labelledBy?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

/** Page section with the standard vertical rhythm and a centered Container. */
export function Section({
  id,
  labelledBy,
  background,
  divider,
  className,
  containerClassName,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(sectionVariants({ background, divider }), className)}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
