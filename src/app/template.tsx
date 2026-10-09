import { PageTransition } from "@/components/motion/PageTransition";

// Remounts on every navigation, so each new page gets the enter transition.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
