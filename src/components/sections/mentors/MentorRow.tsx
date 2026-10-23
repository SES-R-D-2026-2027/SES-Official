"use client";

import { Avatar } from './Avatar';
import { ContactLinks } from './ContactLinks';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { MainMentor } from '@/types/mentors';

export interface MentorRowProps {
  mentor: MainMentor;
  reversed?: boolean;
  index?: number;
  nextTargetId?: string;
  nextTargetLabel?: string;
  onNavigate?: (id: string) => void;
}

const cx = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export function MentorRow({
  mentor,
  reversed = false,
  index = 0,
  nextTargetId,
  nextTargetLabel,
  onNavigate,
}: MentorRowProps) {
  const { name, role, department, comment, photo, color, links, tagline } = mentor;
  const [ref, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.12 });

  // Clean placeholder quote prefix if present
  const displayComment = comment?.startsWith('=== ') ? comment.replace('=== ', '') : comment;

  // Slide direction: reversed enters from right, normal enters from left
  const slideHidden = reversed ? 'translate-x-12' : '-translate-x-12';

  return (
    <article
      ref={ref}
      id={`mentor-row-${index + 1}`}
      className={cx(
        'brut group scroll-mt-24 overflow-hidden rounded-2xl bg-card transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100',
        'hover:-translate-y-1.5 hover:shadow-brut-xl focus-within:-translate-y-1.5 focus-within:shadow-brut-xl',
        isVisible ? 'translate-x-0 opacity-100' : cx(slideHidden, 'opacity-0')
      )}
    >
      {/* Themed top title bar */}
      <div className={cx('flex flex-wrap items-center justify-between border-b-2 border-ink px-4 py-2.5 font-mono text-xs font-bold uppercase gap-2', color)}>
        <div className="flex items-center gap-2">
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink bg-white shadow-brut-sm" />
          <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-ink bg-ink" />
          <span className="ml-1 text-[11px] font-extrabold tracking-wider">{role}</span>
          {reversed && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ink border border-ink shadow-brut-sm">
              🔄 INVERSED LAYOUT
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="rounded bg-white/80 px-2 py-0.5 border border-ink font-bold">
            ROW 0{index + 1} {reversed ? '• (IMAGE RIGHT)' : '• (IMAGE LEFT)'}
          </span>
          <span className="hidden sm:inline font-extrabold">SES ADVISORY</span>
        </div>
      </div>

      <div
        className={cx(
          'grid gap-8 p-6 md:p-8 items-center',
          reversed
            ? 'md:grid-cols-[1.25fr_300px] lg:grid-cols-[1.35fr_340px]'
            : 'md:grid-cols-[300px_1.25fr] lg:grid-cols-[340px_1.35fr]'
        )}
      >
        {/* Photo Avatar Container: on right when reversed! */}
        <div className={cx('flex flex-col items-center justify-center', reversed ? 'md:order-2' : 'md:order-1')}>
          <div className="relative w-full max-w-xs md:max-w-none">
            {/* Themed neo-brutalist offset backing plate */}
            <div
              className={cx(
                'absolute -bottom-3 -right-3 h-full w-full rounded-xl border-2 border-ink',
                color,
                'transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1'
              )}
              aria-hidden="true"
            />
            <Avatar name={name} photo={photo} color={color} className="relative w-full rounded-xl bg-card border-2 border-ink" />

            {/* Corner Badge */}
            <div className="absolute -top-3 -left-3 rounded-md border-2 border-ink bg-white px-2.5 py-1 font-mono text-[10px] font-black uppercase shadow-brut-sm">
              {reversed ? '★ INVERSED MENTOR' : `★ MENTOR 0${index + 1}`}
            </div>
          </div>
        </div>

        {/* Details & Comments (Quote Content) Container: on left when reversed! */}
        <div className={cx('flex flex-col justify-center', reversed ? 'md:order-1' : 'md:order-2')}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx('brut-sm inline-block rounded px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase text-ink', color)}>
              {role}
            </span>
            <span className="brut-sm inline-block rounded bg-white px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-ink">
              {department}
            </span>
            {tagline && (
              <span className="hidden lg:inline-block rounded-md bg-paper px-2 py-0.5 font-mono text-[10px] font-semibold text-ink/80 border border-ink/30">
                {tagline}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl font-black tracking-tight text-ink md:text-3xl lg:text-4xl">
            {name}
          </h3>

          {/* Vibrant Theme-Colored Quote Box (Comments on left when reversed!) */}
          <blockquote
            className={cx(
              'brut-sm relative mt-4 rounded-xl border-2 border-ink p-5 md:p-6 text-base md:text-lg',
              color,
              'font-medium text-ink shadow-brut-sm'
            )}
          >
            <div className="flex items-start gap-2">
              <span className="font-hand select-none text-3xl font-bold leading-none opacity-70 md:text-4xl">“</span>
              <p className="mt-1 leading-relaxed font-sans font-medium text-ink">
                {displayComment}
              </p>
            </div>
            <div className="mt-2 flex justify-end">
              <span className="font-hand select-none text-3xl font-bold leading-none opacity-70 md:text-4xl">”</span>
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-ink/20 pt-2 text-[11px] font-mono font-bold uppercase opacity-85">
              <span>{reversed ? 'Left Column Comment' : 'Executive Reflection'}</span>
              <span>SES Faculty Board</span>
            </div>
          </blockquote>

          {/* Bottom links and Next Scroll Jump trigger */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/10 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <ContactLinks name={name} links={links} />
            </div>

            {nextTargetId && (
              <button
                type="button"
                onClick={() => onNavigate && onNavigate(nextTargetId)}
                className="brut-sm inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase transition-transform hover:-translate-y-0.5 hover:bg-yellow active:translate-y-0"
              >
                <span>{nextTargetLabel || 'Next Scroll'}</span>
                <span className="animate-bounce">↓</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default MentorRow;
