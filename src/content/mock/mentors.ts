import type { MainMentor, MinorMentor } from "@/types/mentors";

export const mainMentors: MainMentor[] = [
  {
    id: "mm1",
    name: "Dr. Sarah Mitchell",
    role: "Faculty Advisor",
    department: "Faculty",
    color: "bg-yellow",
    photo: "/images/mentors/5.png",
    tagline: "Systems Architecture & Academic Leadership",
    comment:
      "The Software Engineering Society serves as the creative engine of our department. Here, students bridge theoretical computing foundations with cutting-edge software practices, shipping production-grade platforms and uplifting their peers.",
    links: { email: "s.mitchell@ses.edu", linkedin: "https://linkedin.com" },
  },
  {
    id: "mm2",
    name: "Prof. David Chen",
    role: "Faculty Mentor",
    department: "Faculty",
    color: "bg-pink",
    photo: "/images/mentors/6.png",
    tagline: "Distributed Systems & Algorithmic Resilience",
    comment:
      "Technical excellence flourishes when students are empowered to take architectural risks and experiment boldly. Our project cohorts tackle real-world distributed challenges, turning classroom concepts into resilient software.",
    links: { email: "d.chen@ses.edu", linkedin: "https://linkedin.com", github: "https://github.com" },
  },
  {
    id: "mm3",
    name: "Alex Rivera",
    role: "Industry Mentor",
    department: "Industry",
    color: "bg-mint",
    photo: "/images/mentors/7.png",
    tagline: "Cloud Infrastructure & Enterprise Scale",
    comment:
      "Connecting academic curiosity with production enterprise workflows gives SES engineers an unfair advantage. The level of collaboration, code discipline, and drive within society cohorts matches top silicon engineering teams.",
    links: { email: "a.rivera@techpartners.io", linkedin: "https://linkedin.com", github: "https://github.com" },
  },
];

export const minorMentors: MinorMentor[] = [
  {
    id: "mn1",
    name: "Tariq Al-Mansoor",
    role: "Alumni Mentor",
    department: "Alumni",
    color: "bg-purple",
    photo: "/images/mentors/8.png",
    bio: "Staff Engineer & Cloud Architect. Supports members with distributed systems design, mock interviews, and career guidance.",
    links: { linkedin: "https://linkedin.com", github: "https://github.com" },
  },
  {
    id: "mn2",
    name: "Jessica Taylor",
    role: "Industry Mentor",
    department: "Industry",
    color: "bg-sky",
    photo: null,
    bio: "Principal Systems Lead. Advises on high-throughput backend services, site reliability engineering, and open-source tooling.",
    links: { linkedin: "https://linkedin.com", email: "jessica.taylor@ses.edu" },
  },
  {
    id: "mn3",
    name: "Zayd Khan",
    role: "Alumni Mentor",
    department: "Alumni",
    color: "bg-yellow",
    photo: null,
    bio: "Senior AI Engineer. Guides student hackathon teams, deep learning models, and applied algorithm research projects.",
    links: { linkedin: "https://linkedin.com", github: "https://github.com" },
  },
  {
    id: "mn4",
    name: "Dr. Clara Gomez",
    role: "Faculty Mentor",
    department: "Faculty",
    color: "bg-pink",
    photo: null,
    bio: "Human-Centered Computing Specialist. Mentors members on accessible UI engineering, design systems, and frontend ergonomics.",
    links: { email: "c.gomez@ses.edu", linkedin: "https://linkedin.com" },
  },
];
