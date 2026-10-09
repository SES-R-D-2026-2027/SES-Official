import type { Department } from "@/types/content";
import { base } from "./_base";

// TODO(content): department names come from the approved homepage mock-up; replace with the
// society's real departments, descriptions and heads.

export const departments: Department[] = [
  {
    ...base("dep-dist", "distributed-systems"),
    name: "Distributed Systems & Cloud",
    shortDescription: "Consensus, queues and the art of keeping many machines in sync.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-1", "tm-2"],
    color: "sky",
    order: 1,
  },
  {
    ...base("dep-compilers", "compilers"),
    name: "Compiler Design & LLVM",
    shortDescription: "Parsers, type checkers and code generators, built from scratch.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-3"],
    color: "mint",
    order: 2,
  },
  {
    ...base("dep-os", "microkernels"),
    name: "Microkernels & OS",
    shortDescription: "Schedulers, memory managers and tiny kernels that actually boot.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-4"],
    color: "lilac",
    order: 3,
  },
  {
    ...base("dep-hw", "hardware"),
    name: "Hardware & RISC-V",
    shortDescription: "Soft cores on FPGAs and the software that talks to them.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-5"],
    color: "coral",
    order: 4,
  },
  {
    ...base("dep-infra", "campus-infrastructure"),
    name: "Campus Infrastructure",
    shortDescription: "The servers, CI and tooling every other team builds on.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-6"],
    color: "yellow",
    order: 5,
  },
  {
    ...base("dep-ml", "applied-ml"),
    name: "Applied Machine Learning",
    shortDescription: "Models that ship inside real tools, not just notebooks.",
    description: "Placeholder description — TODO.",
    responsibilities: ["Placeholder responsibility — TODO"],
    memberIds: ["tm-7"],
    color: "blue",
    order: 6,
  },
];
