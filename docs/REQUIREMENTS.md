# SES Website — Requirements (summary of the approved SoW)

## Functional requirements

| ID | Feature | Must deliver | Acceptance |
|---|---|---|---|
| FR-01 | Homepage & navigation | Hero + CTAs, featured events, projects, announcements; global header, menu, footer | Featured items load from managed content; every primary section reachable from main nav |
| FR-02 | About SES | Overview, vision, mission, objectives, identity, core areas, background | All content areas present with approved copy |
| FR-03 | Departments & structure | Departments listing + detail pages (description, head, members, responsibilities) | Departments/members add/edit/remove via admin, no redevelopment |
| FR-04 | Leadership & team | Profiles: name, position, department, role, photo, short bio, links | Fields display correctly, editable in admin |
| FR-05 | Events | Upcoming + past; title, description, date, time, venue/online, category, **external registration link**, status, images; listing + detail | Grouped by status and date; filterable by category |
| FR-06 | Projects | Title, description, status, technologies, contributors, department/initiative, repo + live links, media; listing + detail | All fields render; new projects appear without code changes |
| FR-07 | Research & development | Initiatives, experimental projects, team info, publications/reports | Initiatives and publications can be added, linked, downloaded |
| FR-08 | Technology areas | Flexible tracks (full stack, frontend, backend, DevOps, MERN, Next.js…) linked to projects/resources | Tracks added/renamed/removed via admin |
| FR-09 | Resources | Learning/technical/workshop resources and reports in editable categories, downloadable files | Categories editable; files download correctly |
| FR-10 | Announcements | Listing + detail; latest items on homepage | Authorized users publish/edit/archive |
| FR-11 | Contact & engagement | Contact info, inquiry form, social links, join/interest form | Valid submissions stored and visible to staff; invalid input rejected |
| FR-12 | Content administration | Secure admin panel with login + role-based access for all content types | Non-developer staff do routine updates alone |

## Non-functional requirements

| ID | Area | Target |
|---|---|---|
| NFR-01 | Responsive | Mobile-first; breakpoints ≈ 360 / 768 / 1280px |
| NFR-02 | Performance | Lighthouse Performance ≥ 80 on key pages; optimized lazy images, static generation where possible, minimal dependencies |
| NFR-03 | Accessibility | WCAG 2.1 AA: semantic HTML, contrast, visible focus, labels, alt text, ordered headings |
| NFR-04 | Security | HTTPS, server-side validation + sanitization, hashed passwords, rate-limited forms, secrets in env (OWASP Top 10) |
| NFR-05 | SEO | Unique titles + meta descriptions, clean URLs, sitemap.xml, robots.txt, Open Graph; all public pages crawlable |
| NFR-06 | Maintainability | Modular, reusable components, configurable content models; new sections without rework |
| NFR-07 | Browsers | Latest 2 versions of Chrome, Firefox, Edge, Safari |
| NFR-08 | Code quality | ESLint/Prettier, PR reviews, inline comments, README; AI-assisted code reviewed by a teammate |
| NFR-09 | Content manageability | Admin forms for every dynamic content type |

## Out of scope (do NOT build)

- O-02 Built-in event registration or ticketing → events only link to an external form.
- O-03 Public member accounts, member login or member portal.
- O-04 Payments, donations, merchandise.
- O-05 Native mobile apps. · O-06 Multi-language. · O-07 Blogs, forums, public comments.
- O-09 Third-party integrations not named in the RFP.

## Sitemap (public)

```
/                       Home (FR-01)
/about                  About SES (FR-02)
/departments            Departments listing (FR-03)
/departments/[slug]     Department detail
/team                   Leadership & team (FR-04)
/events                 Events: upcoming + past, category filter (FR-05)
/events/[slug]          Event detail
/projects               Projects listing (FR-06)
/projects/[slug]        Project detail
/research               R&D initiatives + publications (FR-07)
/research/[slug]        Initiative detail
/technology             Technology areas (FR-08)
/resources              Resources library (FR-09)
/announcements          Announcements listing (FR-10)
/announcements/[slug]   Announcement detail
/contact                Contact + inquiry form (FR-11)
/join                   Join / interest form (FR-11)
/admin/*                Admin panel (FR-12) — later phase
```
