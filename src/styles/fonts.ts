import { Caveat, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";

// All four are variable fonts, so every weight in docs/DESIGN.md §4 is included.
// The `variable` names are consumed by the @theme block in tokens.css.

export const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const caveat = Caveat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

/** Put on <html> so every font CSS variable is available everywhere. */
export const fontVariables = [spaceGrotesk, inter, jetbrainsMono, caveat]
  .map((font) => font.variable)
  .join(" ");
