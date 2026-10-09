---
target: the homepage
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:E:\\ahtasham\\SES-Official\\src\\app\\page.tsx"
target_fingerprint: "sha256:32a30042bbdb76f40ec25dc8fb18abb8950eaaeed73ace1761be3e545c7221c7"
target_path: "E:\\ahtasham\\SES-Official\\src\\app\\page.tsx"
timestamp: 2026-10-09T15-42-30Z
slug: src-app-page-tsx
---
# Homepage critique: 2026-10-09

Method: dual-agent (A: design review · B: detector + browser evidence), run with `/impeccable critique` v4.5.0 against `src/app/page.tsx` on the local dev server, checked at 360 / 768 / 1280.

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | The department map selects on hover with no hover-out, so moving the mouse toward the panel re-selects another node |
| 2 | Match with the real world | 2 | Insider jargon for first-years: "6 nodes", "System map v2", "Dispatches", "peer-reviewed software", "production tools" |
| 3 | User control & freedom | 3 | Draggables spring back and filters reset |
| 4 | Consistency & standards | 2 | Hero chip says "3 active projects" (`Hero.tsx:77`); stats tile says "25 Active projects" (`content/mock/stats.ts:23`) |
| 5 | Error prevention | 3 | External links are labelled properly |
| 6 | Recognition over recall | 3 | Department descriptions hidden behind hover/tap |
| 7 | Flexibility & efficiency | n/a | Persuade surface (landing page) |
| 8 | Aesthetic & minimalist design | 2 | Seven equally loud sections; 6,156px tall at 1280, 10,760px at 360; "6 departments" shown 3 times; calendar repeats the event tiles beside it |
| 9 | Error recovery | 3 | Good empty states for events and announcements; none for projects |
| 10 | Help & documentation | n/a | Landing page |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Design specificity verdict

**LLM assessment:** partly authored, partly interchangeable. The tokens, polaroids, hand notes and copy like "Built at 3 AM. Tested on production." have a real student voice, and the build follows DESIGN.md §6 closely. But the hero never names FAST-NUCES or SES (the H1 says "students"), and the right half is an abstract department map rather than people. Remove the logo and it could be any CS club on a neobrutalist bento template.

**Deterministic scan:** the static `impeccable detect` scan of the page, home sections, ui, layout and bento folders came back clean (0 findings). The in-browser overlay reported 28 flags, nearly all false positives for this brief:

- text-overflow (15): measured while the browser pane was hidden at 0px width. Re-checked at 360 and 1280 with no overflow. False positive.
- bounce-easing (6): `--ease-brutal` (`tokens.css:111`) is the deliberate "small overshoot = playful" token. On brief.
- nested-cards (8): polaroids and stickers inside tiles are the design language. Only the countdown block inside the featured event tile and the pinned announcement card are worth a look.
- kicker-above-heading (3): tag eyebrows on hero, Lab Life and Join CTA. On brief, though repeated three times it reads a bit formulaic.
- all-caps-body (2), cramped-padding (1): short mono labels; marginal.

The detector missed everything that matters below (the contradictory numbers, the map interaction, the mobile Register overflow); those came from the design review.

**Visual overlays:** the overlay ran but the live server was stopped afterwards, so no overlay is left open.

Page-level horizontal overflow: none at 360 or 1280.

## Overall impression

The craft is high and the spec was followed faithfully, but the page is trying to show everything at full volume. The single biggest opportunity is the first five seconds: say who SES is, that it is at FAST-NUCES, and that first-years with no experience are welcome, in plain words next to the Join button.

## What's working

1. **Spec fidelity and token discipline.** Events and projects bentos match the §6.5/§6.6 diagrams, the announcements right half is filled (§6.7), the Join H2 is ink on coral (§6.8). No hex codes or arbitrary values in the sections.
2. **Real accessibility craft.** sr-only context on repeated "Read"/"Details" links, a captioned `<table>` calendar, aria-hidden countdown with the date as text, reduced motion honoured across MotionConfig, CountUp, DrawPath, `press` and `straighten`, a noscript reveal fallback, visible skip link and focus ring.
3. **Voice and honest placeholders.** "missed it? next time!", "The photo dump", clearly marked "Photo soon" placeholders.

## Priority issues

**[P1] The hero doesn't say who this is for or that beginners are welcome**
- Why: the page's main goal is "join". The intro (`content/home.ts:17`) is jargon ("interconnected engineering collective running production tools and peer-reviewed software"), and the one reassurance, "start here! no experience needed", is a decorative `aria-hidden` hand note (`Hero.tsx:67`), so screen readers never hear it.
- Fix: name "Software Engineering Society, FAST-NUCES" in the tag or intro; rewrite the intro in plain language; put "No experience needed" as real text by the CTA and keep the hand note as flavour.
- Command: `/impeccable clarify`

**[P1] Contradictory and repeated numbers**
- Why: "3 active projects" in the hero vs "25 Active projects" in the stats row, and "6 departments" three times. A visitor who notices stops trusting every number.
- Fix: one source per stat; drop the hero chip row or derive it from the same data as the stats tiles; show each figure once.
- Command: `/impeccable distill`

**[P1] Department map is broken for mouse, keyboard and small screens**
- Why: `onMouseEnter` and `onFocus` both select (`DepartmentMap.tsx:91-92`) with no leave handling, so the mouse path to the panel re-selects whatever it crosses. Keyboard users tab through all six nodes before reaching the panel link, so it only ever applies to the last node. The panel is `aria-live`, so every focus is announced. At 360 the 96px nodes overlap inside a 284px square.
- Fix: select on click/Enter only; put the "Meet the team" link next to the selected node or make the nodes links; use tabs/radio semantics instead of `aria-pressed`; render a plain list on mobile.
- Command: `/impeccable harden`

**[P2] "Register for Hackathon (Nov 08)" overflows the hero card at 360**
- Why: `whitespace-nowrap` in the shared button classes (`Button.tsx:9`) pushes the button 12px past the card edge. DESIGN.md §1 says imperfection must never come from broken spacing.
- Fix: allow wrapping / full width under `sm`, or a shorter mobile label.
- Command: `/impeccable adapt`

**[P2] Flat, over-long hierarchy, and no route to the projects page**
- Why: every tile is equally loud, so nothing says "do this now". Events has ~13 targets in one section; the featured event's Register button is ~850px below its heading on mobile. Nothing in `<main>` links to `/projects` ("Explore all repositories" goes to the github.com root; the featured project links only to example.com and the repo).
- Fix: quiet secondary tiles (calendar, GitHub stats, past events) to paper; drop the calendar's duplicate event list; add "See all projects →" to `/projects` and an internal details link on the featured project; shrink the featured photo on mobile.
- Commands: `/impeccable distill`, then `/impeccable layout`

## Persona red flags

**Jordan (first-timer):** doesn't learn it's FAST-NUCES from the hero; meets "compilers, distributed systems, RISC-V, microkernels" before any beginner signal; the beginner reassurance is decorative; sees conflicting stats and labels like "Dispatches" and "6 nodes".

**Riley (stress tester):** ProjectsBento has no empty state (with no projects it still shows GitHub stats and "0 students shipped code"); hero chip would say "0 active projects"; featured event/project titles aren't clamped; 10 visible "TODO" strings and placeholder links (github.com root, discord.com root, example.com); the calendar tile only shows the first event's month.

**Casey (mobile, one hand):** 10,760px page with the second Join CTA ~12 screens after the first; 16 tap targets under 44px (filter chips 32px, "Be next" link 19px at `ProjectsBento.tsx:254`); filters wrap to two rows; tapping a map node updates a panel that may be below the fold; Register overflows its card.

**Sam (keyboard / screen reader):** the map's keyboard dead end and live-region chatter; "no experience needed" is never announced; the lab photo `<ul tabIndex=0>` (`LabLife.tsx:38`) stays a tab stop on desktop where it doesn't scroll; whole-tile links get very long accessible names. Skip link, focus ring, sr-only stats heading and the filter `role=status` are good.

## Minor observations

- GitHub stats count up from 0, so a fast scroll shows "0 repos" for a moment.
- "drag us around!" and the draggable stickers have no affordance on touch.
- Hand notes on only 2 of 4 stat tiles (matches spec, looks uneven).
- The pinned announcement is louder than the list it belongs to.
- The Join CTA H2 uses the H1 size and competes with the hero H1.
- The countdown fits with zero slack at 360 (284/284px).

## Questions to consider

1. If a first-year saw the hero for five seconds, would they know it's FAST-NUCES and that they're welcome without knowing what a microkernel is?
2. Does the department map earn the hero's right half over a real photo of students?
3. When every tile is a different vibrant colour, which colour means "do this now"?
