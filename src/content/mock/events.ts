import type { Event } from "@/types/content";
import { base } from "./_base";

// Real SES events (content doc, Oct 2026). Times are UTC instants; the site shows them in campus
// time (PKT). Registration links are EXTERNAL only (O-02).
// Event media is stored in R2 under v1/images/events/<slug>/.
// Add new media through the approved admin upload flow, then reference its /media/... URL.

export const events: Event[] = [
  /* ───────── ongoing ───────── */
  {
    ...base("ev-workshops", "workshops"),
    title: "Workshops",
    summary:
      "Student-led workshops covering core courses, emerging technologies, and practical skills.",
    description:
      "SES organizes workshops throughout the semester on core courses and topics such as PF, OOP, DSA, AI automation, and game development. These sessions help students strengthen their concepts, learn new tools, and gain hands-on experience.",
    category: "workshop",
    // TODO(content): runs "throughout the semester" with no fixed dates; these are placeholder
    // Fall 2026 semester bounds so the series shows as ongoing.
    startsAt: "2026-08-24T04:00:00.000Z",
    endsAt: "2026-12-18T12:00:00.000Z",
    venue: "FAST NUCES Islamabad",
    isOnline: false,
    badge: "Workshop",
    coverImage: {
      url: "/media/v1/images/events/soventure/Soventure_pf_workshop.jpg",
      alt: "Students attending an SES technical workshop session",
    },
    gallery: [
      {
        url: "/media/v1/images/events/soventure/Soventure_Cursor_Session.png",
        alt: "Hands-on Cursor AI coding session",
      },
      {
        url: "/media/v1/images/events/canva-workshop/audience.jpg",
        alt: "Students participating in a campus workshop",
      },
    ],
    isFeatured: false,
    color: "lilac",
  },

  /* ───────── past ───────── */
  {
    ...base("ev-canva-workshop-26", "canva-portfolio-branding-workshop"),
    title: "Canva x SES: Portfolio & Personal Branding Workshop",
    summary: "A collaborative workshop with Canva focused on portfolio building and personal branding.",
    description:
      "SES collaborated with Canva to help students build professional portfolios, strengthen their personal brands, and create effective CVs. The workshop offered practical guidance on presenting skills and experience to stand out in the professional world.",
    category: "workshop",
    // TODO(content): exact start time not provided; 12:00 PKT used as a placeholder.
    startsAt: "2026-10-20T07:00:00.000Z",
    isOnline: false,
    badge: "Workshop",
    coverImage: {
      url: "/media/v1/images/events/canva-workshop/cover.jpg",
      alt: "Canva x SES Portfolio & Personal Branding Workshop banner",
    },
    gallery: [
      {
        url: "/media/v1/images/events/canva-workshop/speaker.jpg",
        alt: "Speaker session at Canva portfolio and personal branding workshop",
      },
      {
        url: "/media/v1/images/events/canva-workshop/audience.jpg",
        alt: "Attendees engaged in the Canva portfolio session",
      },
    ],
    isFeatured: false,
    color: "sky",
  },
  {
    ...base("ev-welcome-orientation", "welcome-and-orientation"),
    title: "Welcome and Orientation",
    summary:
      "Helping new students settle into university life through orientation activities, fun, and a welcome party.",
    description:
      "SES welcomes new students with fun activities and a welcome party featuring dinner and entertainment. As part of the university orientation, SES also organizes activities to help students connect with seniors, get familiar with campus life, and feel at home in their new environment.",
    category: "meetup",
    // TODO(content): held at the "start of Fall semester"; exact date not provided, placeholder used.
    startsAt: "2026-08-24T04:00:00.000Z",
    venue: "FAST NUCES Islamabad",
    isOnline: false,
    badge: "Welcome",
    coverImage: {
      url: "/media/v1/images/events/orientation/Orientation_2025.JPG",
      alt: "SES Welcome and Orientation event at FAST NUCES",
    },
    gallery: [
      {
        url: "/media/v1/images/events/orientation/orientation_25batch.jpg",
        alt: "Batch 2025 students gathering at the SES Orientation",
      },
      {
        url: "/media/v1/images/events/orientation/Orientation_2025(1).JPG",
        alt: "Orientation activities and senior-junior networking",
      },
      {
        url: "/media/v1/images/events/orientation/Orientation_2025(2).JPG",
        alt: "Orientation fun games and team building moments",
      },
    ],
    isFeatured: false,
    color: "mint",
  },
  {
    ...base("ev-soventure-25", "soventure"),
    title: "Soventure",
    summary:
      "Bringing together a diverse range of tech and recreational activities, from technical competitions and workshops to bonfire night.",
    description:
      "Held from November 27–29, 2025, SOVENTURE was the first-ever flagship event of Software Engineering Society (SES). Bringing together 1,000+ participants, the three-day event featured tech competitions, workshops, and recreational activities, including Valorant, Tekken, FIFA, PF and Game Development workshops, a Web Development Hackathon, Bug Busters, UI/UX Arena, a bonfire, and a Qawwali night. SOVENTURE aimed to bridge academia and industry while fostering innovation, collaboration, technical excellence, and community through a blend of technology and entertainment.",
    category: "competition",
    // TODO(content): only the dates were provided; 09:00 PKT start and end-of-day finish are placeholders.
    startsAt: "2025-11-27T04:00:00.000Z",
    endsAt: "2025-11-29T18:59:00.000Z",
    venue: "FAST NUCES Islamabad",
    isOnline: false,
    badge: "Flagship event",
    coverImage: {
      url: "/media/v1/images/events/soventure/Soventure_Banners.jpg",
      alt: "Soventure flagship event official banner and entrance",
    },
    gallery: [
      {
        url: "/media/v1/images/events/soventure/soventure_bonfire.jpg",
        alt: "Evening bonfire celebration at Soventure",
      },
      {
        url: "/media/v1/images/events/soventure/Soventure_chess_tournament.JPG",
        alt: "Competitors in the Soventure chess tournament",
      },
      {
        url: "/media/v1/images/events/soventure/Soventure_Cursor_Session.png",
        alt: "Soventure Cursor AI developer workshop",
      },
      {
        url: "/media/v1/images/events/soventure/Soventure_pf_workshop.jpg",
        alt: "Programming fundamentals workshop in action at Soventure",
      },
      {
        url: "/media/v1/images/events/soventure/soventure_stalls.jpg",
        alt: "Recreational stalls and student booths at Soventure",
      },
    ],
    isFeatured: true,
    color: "yellow",
  },
  {
    ...base("ev-arbisoft-25", "arbisoft-x-ses"),
    title: "Arbisoft x SES",
    summary:
      "A live mock interview session with Arbisoft experts offering students a glimpse into real-world industry hiring practices.",
    description:
      "SES collaborated with Arbisoft to host a live mock interview featuring two industry experts conducting HR and technical interview rounds with a student volunteer. The session gave students practical insight into industry hiring practices, concluding with shields presented to the guest speakers as a token of appreciation.",
    category: "talk",
    // TODO(content): exact start time not provided; 12:00 PKT used as a placeholder.
    startsAt: "2025-02-27T07:00:00.000Z",
    venue: "Auditorium, FAST NUCES Islamabad",
    isOnline: false,
    badge: "Industry collab",
    coverImage: {
      url: "/media/v1/images/events/arbisoft/Arbisoft_speaker_session.JPG",
      alt: "Arbisoft guest speaker addressing students at the mock interview session",
    },
    gallery: [
      {
        url: "/media/v1/images/events/arbisoft/arbisoft_SES_collab.JPG",
        alt: "SES executive team presenting shield to Arbisoft experts",
      },
      {
        url: "/media/v1/images/events/arbisoft/arbisoft_session.JPG",
        alt: "Students attending the live mock interview session in the auditorium",
      },
    ],
    isFeatured: false,
    color: "coral",
  },
];
