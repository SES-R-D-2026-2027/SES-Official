import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ExternalLinkHint, externalLinkProps } from "./ExternalLinkHint";

export const buttonVariants = cva(
  "group inline-flex press items-center justify-center gap-2 brutal font-semibold whitespace-nowrap no-underline focus-ring disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary",
        accent: "bg-accent text-on-accent",
        mint: "bg-tile-mint text-ink",
        ghost: "bg-surface text-ink",
      },
      size: {
        sm: "rounded-brutal-sm px-3 py-1.5 text-sm",
        md: "px-5 py-2.5 text-base",
        lg: "px-6 py-3.5 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonStyleProps = VariantProps<typeof buttonVariants> & {
  /** Trailing arrow that slides 2px on hover ("Join SES →"). */
  arrow?: boolean;
  /** Leading icon (a lucide element with aria-hidden). */
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};

type NativeButtonProps = Omit<ComponentProps<"button">, keyof ButtonStyleProps> & {
  href?: undefined;
};

type NativeLinkProps = Omit<ComponentProps<"a">, keyof ButtonStyleProps | "href"> & {
  href: string;
  /** Opens in a new tab with icon + sr-only hint (registration, GitHub, Discord). */
  external?: boolean;
};

export type ButtonProps = ButtonStyleProps & (NativeButtonProps | NativeLinkProps);

/**
 * A button, or a link styled as one when `href` is set.
 * `external` renders a plain <a target="_blank"> with an external-link icon.
 */
export function Button({ variant, size, arrow, icon, className, children, ...rest }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 transition-transform duration-(--ses-duration-fast) ease-soft group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { href, external, ...anchorProps } = rest as NativeLinkProps;
    if (external) {
      return (
        <a href={href} className={classes} {...externalLinkProps} {...anchorProps}>
          {content}
          <ExternalLinkHint />
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as NativeButtonProps;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
