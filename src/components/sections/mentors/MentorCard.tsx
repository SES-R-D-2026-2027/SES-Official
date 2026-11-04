"use client";

import { Avatar } from './Avatar';
import { ContactLinks } from './ContactLinks';
import type { MinorMentor } from '@/types/mentors';

export interface MentorCardProps {
  mentor: MinorMentor;
  index?: number;
  isVisible?: boolean;
}

const cx = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

export function MentorCard({ mentor, index = 0, isVisible = true }: MentorCardProps) {
  const { name, role, department, bio, photo, color, links } = mentor;

  // Clean placeholder bio prefix if present
  const displayBio = bio?.startsWith('=== ') ? bio.replace('=== ', '') : bio;

  // Stagger delays for column cards
  const delays = ['delay-0', 'delay-100', 'delay-200', 'delay-300', 'delay-400'];
  const delayClass = delays[index % delays.length];

  return (
    <article
      className={cx(
        'brut group flex flex-col overflow-hidden rounded-2xl bg-card transition-all duration-500 ease-out motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100',
        'hover:-translate-y-2 hover:shadow-brut-xl focus-within:-translate-y-2 focus-within:shadow-brut-xl',
        index % 2 === 0 ? 'hover:rotate-[-1deg]' : 'hover:rotate-[1deg]',
        delayClass,
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      )}
    >
      {/* Themed top accent header */}
      <div className={cx('flex items-center justify-between border-b-2 border-ink px-3.5 py-2 font-mono text-[11px] font-bold uppercase', color)}>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full border border-ink bg-white shadow-brut-sm" />
          <span className="tracking-wide font-extrabold">{department}</span>
        </div>
        <span className="rounded bg-white/80 px-1.5 py-0.5 border border-ink text-[10px] font-black">M0{index + 1}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="relative mb-3">
          {/* Subtle themed accent offset */}
          <div
            className={cx('absolute -bottom-1.5 -right-1.5 h-full w-full rounded-xl border-2 border-ink', color)}
            aria-hidden="true"
          />
          <Avatar name={name} photo={photo} color={color} className="relative rounded-xl bg-card border-2 border-ink" />

          {/* Quick chip */}
          <div className="absolute -bottom-2 -left-2 rounded bg-white px-2 py-0.5 font-mono text-[9px] font-black uppercase text-ink border border-ink shadow-brut-sm">
            {department}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className={cx('brut-sm inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-ink', color)}>
            {role}
          </span>
        </div>

        <h3 className="mt-2 text-xl font-black tracking-tight text-ink">{name}</h3>
        <p className="font-mono text-xs font-bold uppercase text-ink/60">{department} Specialist</p>

        {/* Themed subtle bio block */}
        <div className={cx('mt-3 flex-1 rounded-lg border-2 border-ink p-3', color, 'bg-opacity-20')}>
          <p className="text-xs font-medium leading-relaxed text-ink">{displayBio}</p>
        </div>

        <div className="mt-4 pt-3 border-t-2 border-ink/10">
          <ContactLinks name={name} links={links} />
        </div>
      </div>
    </article>
  );
}

export default MentorCard;
