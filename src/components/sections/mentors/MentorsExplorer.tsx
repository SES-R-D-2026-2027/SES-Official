"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { MentorRow } from './MentorRow';
import { MentorCard } from './MentorCard';
import type { MainMentor, MinorMentor } from '@/types/mentors';

export interface MentorsExplorerProps {
  mainMentors?: MainMentor[];
  minorMentors?: MinorMentor[];
}

const cx = (...classes: (string | boolean | undefined | null)[]) => classes.filter(Boolean).join(' ');

// Shared CTA Banner matching user's component
function CTABanner({
  title = 'Learn from the best',
  text = 'Join SES and receive 1-on-1 mentorship, code reviews, and career guidance directly from our advisory network.',
  label = 'Join SES',
  to = '/join',
  color = 'bg-purple',
}: {
  title?: string;
  text?: string;
  label?: string;
  to?: string;
  color?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className="mx-auto max-w-6xl px-4 pb-16">
      <div className={`brut flex flex-col items-start justify-between gap-4 rounded-xl p-6 md:flex-row md:items-center md:p-8 ${color}`}>
        <div>
          <h2 id="cta-heading" className="text-2xl font-bold md:text-3xl text-ink">{title}</h2>
          <p className="mt-1 max-w-xl text-ink/80">{text}</p>
        </div>
        <Link
          href={to}
          className="brut-sm inline-block rounded-lg bg-yellow px-5 py-2.5 font-mono text-sm font-bold uppercase text-ink shadow-brut transition-transform hover:-translate-y-0.5"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}

export function MentorsExplorer({ mainMentors = [], minorMentors = [] }: MentorsExplorerProps) {
  const [data, setData] = useState<{ main: MainMentor[]; minor: MinorMentor[] }>({
    main: mainMentors,
    minor: minorMentors,
  });

  useEffect(() => {
    setData({ main: mainMentors, minor: minorMentors });
  }, [mainMentors, minorMentors]);

  const [activeStep, setActiveStep] = useState(0);
  const [selectedDept, setSelectedDept] = useState('all');
  const [stepScrollEnabled, setStepScrollEnabled] = useState(true);

  const isNavigatingRef = useRef(false);
  const stepScrollEnabledRef = useRef(stepScrollEnabled);
  stepScrollEnabledRef.current = stepScrollEnabled;

  // Ordered scroll target IDs
  const stepIds = useMemo(() => ['mentors-hero', 'mentor-row-1', 'mentor-row-2', 'mentor-row-3', 'mentors-grid'], []);

  const stepMeta = [
    { id: 'mentors-hero', num: '00', label: 'Overview', color: 'bg-white', activeColor: 'bg-yellow' },
    { id: 'mentor-row-1', num: '01', label: '1st: Faculty Advisor', color: 'bg-yellow', activeColor: 'bg-yellow' },
    { id: 'mentor-row-2', num: '02', label: '2nd: Inversed Mentor', color: 'bg-pink', activeColor: 'bg-pink' },
    { id: 'mentor-row-3', num: '03', label: '3rd: Industry Mentor', color: 'bg-mint', activeColor: 'bg-mint' },
    { id: 'mentors-grid', num: '04', label: 'Last: Mentors Grid', color: 'bg-purple', activeColor: 'bg-purple' },
  ];

  // Smooth navigation helper to target section
  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    isNavigatingRef.current = true;

    // Compute offset factoring in sticky navbar (~75px)
    const yOffset = -80;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });

    const idx = stepIds.indexOf(targetId);
    if (idx !== -1) {
      setActiveStep(idx);
    }

    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 750);
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (!data.main.length) return;

    const observers: IntersectionObserver[] = [];
    stepIds.forEach((id, index) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isNavigatingRef.current) {
            setActiveStep(index);
          }
        },
        { threshold: 0.25, rootMargin: '-60px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [data, stepIds]);

  // Wheel listener: 1st scroll -> row 1, 2nd -> row 2 (inverse), 3rd -> row 3, last -> col of mentors
  useEffect(() => {
    if (!data.main.length) return;

    const handleWheel = (e: WheelEvent) => {
      if (!stepScrollEnabledRef.current) return;
      if (isNavigatingRef.current) {
        e.preventDefault();
        return;
      }

      // Check if user is scrolling up/down with significant intent
      if (Math.abs(e.deltaY) < 22) return;

      const isScrollingDown = e.deltaY > 0;

      // If at mentors-grid (step 4)
      if (activeStep === 4) {
        if (!isScrollingDown) {
          // If scrolling UP while near top of mentors-grid, smoothly scroll back to mentor-row-3
          const gridEl = document.getElementById('mentors-grid');
          if (gridEl && gridEl.getBoundingClientRect().top >= 60) {
            e.preventDefault();
            scrollToTarget('mentor-row-3');
          }
        }
        // When scrolling down inside mentors-grid, allow free normal scrolling
        return;
      }

      // Steps 0 to 3: step-by-step navigation
      if (isScrollingDown) {
        e.preventDefault();
        const nextStep = Math.min(activeStep + 1, stepIds.length - 1);
        scrollToTarget(stepIds[nextStep]);
      } else {
        if (activeStep > 0) {
          e.preventDefault();
          const prevStep = Math.max(activeStep - 1, 0);
          scrollToTarget(stepIds[prevStep]);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [data, activeStep, stepIds]);

  // Filter minor mentors by department
  const filteredMinorMentors = useMemo(() => {
    if (!data.minor) return [];
    if (selectedDept === 'all') return data.minor;
    return data.minor.filter((m) => m.department.toLowerCase() === selectedDept.toLowerCase());
  }, [data, selectedDept]);

  const departments = ['all', 'Alumni', 'Industry', 'Faculty'];

  return (
    <div className="relative min-h-screen bg-dots pb-20">
      {/* Decorative top ambient color glows */}
      <div className="pointer-events-none absolute left-0 top-0 h-96 w-96 rounded-full bg-yellow/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-pink/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/3 top-96 h-96 w-96 rounded-full bg-mint/15 blur-3xl" aria-hidden="true" />

      {/* Floating Side Step Navigator Dock (Visible on desktop & large tablets) */}
      <aside
        aria-label="Scroll Step Indicator"
        className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex"
      >
        <div className="brut rounded-xl bg-card p-2 shadow-brut">
          <div className="mb-2 border-b border-ink/20 pb-1.5 text-center font-mono text-[9px] font-black uppercase tracking-wider text-ink/70">
            SCROLL DOCK
          </div>
          <nav className="flex flex-col gap-1.5">
            {stepMeta.map((s, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => scrollToTarget(s.id)}
                  aria-label={`Scroll to ${s.label}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={cx(
                    'group flex items-center justify-between gap-2.5 rounded-lg border border-ink px-2.5 py-1 text-left font-mono text-[11px] font-bold transition-all',
                    isActive
                      ? cx(s.activeColor, 'shadow-brut-sm translate-x-[-2px] text-ink')
                      : 'bg-white hover:bg-paper hover:translate-x-[-1px]'
                  )}
                >
                  <span className="text-[10px] opacity-75">{s.num}</span>
                  <span className="font-extrabold">{s.label.split(':')[0]}</span>
                  <span
                    className={cx(
                      'h-2 w-2 rounded-full border border-ink',
                      isActive ? 'bg-ink' : s.color
                    )}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Toggle Step Scroll Button */}
        <button
          type="button"
          onClick={() => setStepScrollEnabled(!stepScrollEnabled)}
          className={cx(
            'brut-sm rounded-lg border border-ink px-2 py-1 font-mono text-[9px] font-bold uppercase shadow-brut-sm transition-all',
            stepScrollEnabled ? 'bg-mint text-ink' : 'bg-white text-ink/70'
          )}
          title="Toggle automatic snap scrolling on mouse wheel"
        >
          {stepScrollEnabled ? '⚡ Step Scroll: ON' : 'Scroll: Free'}
        </button>
      </aside>

      {/* Hero Section (Step 0) */}
      <section id="mentors-hero" className="mx-auto max-w-6xl px-4 pt-10 scroll-mt-24">
        <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase">
          <Link href="/" className="font-semibold hover:underline">Home</Link>
          <span className="mx-2 text-ink/40">/</span>
          <span className="brut-sm inline-block rounded bg-yellow px-2 py-0.5 font-black" aria-current="page">
            Mentors
          </span>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="brut-sm inline-flex items-center gap-1.5 rounded-full bg-pink px-3 py-1 font-mono text-xs font-black uppercase text-ink">
            <span>★</span> SES FACULTY &amp; INDUSTRY ADVISORY
          </span>
          <span className="brut-sm inline-block rounded-full bg-mint px-3 py-1 font-mono text-xs font-black uppercase text-ink">
            INVERSED ROW FLOW
          </span>
          <span className="brut-sm inline-block rounded-full bg-purple px-3 py-1 font-mono text-xs font-black uppercase text-ink">
            4-STEP SCROLL EXPERIENCE
          </span>
        </div>

        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
          Guidance That Inspires.{' '}
          <span className="brut-sm relative inline-block rotate-[-1deg] rounded-lg bg-yellow px-3 py-1 text-ink shadow-brut">
            Our Mentors
          </span>
        </h1>

        <p className="mt-5 max-w-3xl text-lg font-medium leading-relaxed text-ink/80 md:text-xl">
          Meet the professors, alumni innovators, and enterprise architects dedicated to guiding student engineers toward
          technical excellence. Explore our 3 main mentor rows (with the middle row inverted) followed by the domain mentor column.
        </p>

        {/* Themed Metric Stat Chips */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="brut rounded-xl bg-yellow p-4 transition-transform hover:-translate-y-1">
            <p className="font-mono text-3xl font-black">01</p>
            <p className="text-sm font-black uppercase tracking-wider">Faculty Advisor</p>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink/75">Row 1 • Image Left</p>
          </div>
          <div className="brut rounded-xl bg-pink p-4 transition-transform hover:-translate-y-1">
            <p className="font-mono text-3xl font-black">02</p>
            <p className="text-sm font-black uppercase tracking-wider">Inversed Row</p>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink/75">Row 2 • Image Right</p>
          </div>
          <div className="brut rounded-xl bg-mint p-4 transition-transform hover:-translate-y-1">
            <p className="font-mono text-3xl font-black">03</p>
            <p className="text-sm font-black uppercase tracking-wider">Industry Mentor</p>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink/75">Row 3 • Image Left</p>
          </div>
          <div className="brut rounded-xl bg-purple p-4 transition-transform hover:-translate-y-1">
            <p className="font-mono text-3xl font-black">04</p>
            <p className="text-sm font-black uppercase tracking-wider">Mentors Grid</p>
            <p className="mt-1 font-mono text-[11px] font-semibold text-ink/75">Domain Specialists</p>
          </div>
        </div>

        {/* Quick Scroll Step Controller Banner */}
        <div className="brut mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-ink bg-card p-4 shadow-brut-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-yellow font-mono text-sm font-black">
              ↓
            </span>
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-wider text-ink">
                1st Scroll Interaction
              </p>
              <p className="text-sm font-medium text-ink/75">
                Scroll your mouse wheel down to step through: Row 1 → Row 2 (Inversed) → Row 3 → Mentors Grid.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToTarget('mentor-row-1')}
              className="brut-sm inline-flex items-center gap-1.5 rounded-lg bg-yellow px-3.5 py-1.5 font-mono text-xs font-black uppercase transition-transform hover:-translate-y-0.5 hover:shadow-brut active:translate-y-0"
            >
              <span>1st Scroll: Row 01</span>
              <span className="animate-subtle-bounce">↓</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget('mentor-row-2')}
              className="brut-sm inline-flex items-center gap-1.5 rounded-lg bg-pink px-3.5 py-1.5 font-mono text-xs font-black uppercase transition-transform hover:-translate-y-0.5 hover:shadow-brut active:translate-y-0"
            >
              <span>2nd Scroll: Row 02 (Inversed)</span>
              <span className="animate-subtle-bounce">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Mentors Rows Section (Step 1, 2, 3) */}
      <section aria-labelledby="main-heading" className="mx-auto max-w-6xl px-4 pt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-ink bg-yellow" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-ink/70">
                ADVISORY PILLARS
              </span>
            </div>
            <h2 id="main-heading" className="mt-1 text-3xl font-black md:text-4xl">
              Main Mentors
            </h2>
            <p className="mt-1 text-sm font-medium text-ink/75">
              The central mentors of the society. The middle row (Row 02) is inversed with the photo on the right and comments on the left.
            </p>
          </div>

          {/* Progress pills */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <span className={cx('rounded-md border border-ink px-2 py-1', activeStep === 1 ? 'bg-yellow shadow-brut-sm' : 'bg-white')}>
              01 Normal
            </span>
            <span className={cx('rounded-md border border-ink px-2 py-1', activeStep === 2 ? 'bg-pink shadow-brut-sm' : 'bg-white')}>
              02 Inversed 🔄
            </span>
            <span className={cx('rounded-md border border-ink px-2 py-1', activeStep === 3 ? 'bg-mint shadow-brut-sm' : 'bg-white')}>
              03 Normal
            </span>
          </div>
        </div>

        {data.main.length ? (
          <div id="mentor-rows-container" className="flex flex-col gap-10">
            {data.main.map((mentor, index) => {
              // Middle mentor (index 1 / row 2) is inversed: image on right, comments on left
              const isMiddleInversed = index === 1;
              const nextTargetId = index === 0 ? 'mentor-row-2' : index === 1 ? 'mentor-row-3' : 'mentors-grid';
              const nextTargetLabel =
                index === 0
                  ? '2nd Scroll: Mentor 02 (Inversed)'
                  : index === 1
                  ? '3rd Scroll: Mentor 03'
                  : 'Last Scroll: Mentors Grid';

              return (
                <MentorRow
                  key={mentor.id}
                  mentor={mentor}
                  index={index}
                  reversed={isMiddleInversed}
                  nextTargetId={nextTargetId}
                  nextTargetLabel={nextTargetLabel}
                  onNavigate={scrollToTarget}
                />
              );
            })}
          </div>
        ) : (
          <p className="brut mt-6 rounded-xl bg-card p-6 font-bold">No main mentors listed yet.</p>
        )}
      </section>

      {/* Minor Mentors Grid / Column Section (Step 4 / Last Target) */}
      <section id="mentors-grid" aria-labelledby="minor-heading" className="mx-auto max-w-6xl px-4 py-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-ink bg-purple" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-ink/70">
                STEP 04 • THE ADVISORY COLLECTIVE
              </span>
            </div>
            <h2 id="minor-heading" className="mt-1 text-3xl font-black md:text-4xl">
              Mentors Directory
            </h2>
            <p className="mt-1 text-sm font-medium text-ink/75">
              Alumni leaders, research fellows, and domain specialists supporting members across technical tracks.
            </p>
          </div>

          {/* Department filter chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-xs font-bold uppercase text-ink/70 mr-1">Filter:</span>
            {departments.map((dept) => {
              const isSel = selectedDept.toLowerCase() === dept.toLowerCase();
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={cx(
                    'brut-sm rounded-lg px-2.5 py-1 font-mono text-xs font-black uppercase transition-all',
                    isSel ? 'bg-purple text-ink shadow-brut-sm' : 'bg-white hover:bg-paper'
                  )}
                >
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {filteredMinorMentors.length ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredMinorMentors.map((m, idx) => (
              <MentorCard key={m.id} mentor={m} index={idx} />
            ))}
          </div>
        ) : (
          <p className="brut mt-6 rounded-xl bg-card p-6 font-bold">No mentors listed for this department.</p>
        )}

        {/* Back to top or main mentors navigator */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-ink bg-card p-4">
          <span className="font-mono text-xs font-bold uppercase text-ink/70">
            Reached end of Mentors Advisory
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollToTarget('mentor-row-2')}
              className="brut-sm rounded-lg bg-pink px-3 py-1 font-mono text-xs font-bold uppercase transition-transform hover:-translate-y-0.5"
            >
              ↑ Inversed Mentor (Row 2)
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget('mentor-row-1')}
              className="brut-sm rounded-lg bg-yellow px-3 py-1 font-mono text-xs font-bold uppercase transition-transform hover:-translate-y-0.5"
            >
              ↑ 1st Mentor (Row 1)
            </button>
            <button
              type="button"
              onClick={() => scrollToTarget('mentors-hero')}
              className="brut-sm rounded-lg bg-white px-3 py-1 font-mono text-xs font-bold uppercase transition-transform hover:-translate-y-0.5 hover:bg-paper"
            >
              ↑ Top of Page
            </button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner
        title="Learn from the best"
        text="Join SES and receive 1-on-1 mentorship, code reviews, and career guidance directly from our advisory network."
        label="Join SES"
      />
    </div>
  );
}

export default MentorsExplorer;
