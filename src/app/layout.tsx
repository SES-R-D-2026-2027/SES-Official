import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata = buildMetadata();

// Motion renders reveal elements hidden in the server HTML; without JS they must still show.
// (stroke-dasharray covers <DrawPath> doodles, which start at pathLength 0.)
const noscriptRevealFallback =
  "[data-reveal]{opacity:1!important;transform:none!important;stroke-dasharray:none!important}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme={siteConfig.theme} className={fontVariables} suppressHydrationWarning>
      <head>
        <link
          id="ses-theme-favicon"
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/brand/favicon-light.png?v=4"
        />
        <Script id="ses-theme-init" strategy="beforeInteractive">
          {`try {
            const saved = localStorage.getItem("ses-theme");
            const theme = saved === "dark" || saved === "neo" ? saved : document.documentElement.dataset.theme;
            if (theme === "dark" || theme === "neo") document.documentElement.dataset.theme = theme;
            const icon = document.getElementById("ses-theme-favicon");
            if (icon) icon.setAttribute("href", theme === "dark" ? "/brand/favicon-dark.png?v=4" : "/brand/favicon-light.png?v=4");
          } catch {}`}
        </Script>
      </head>
      <body className="flex min-h-dvh flex-col">
        <noscript>
          <style>{noscriptRevealFallback}</style>
        </noscript>
        <MotionProvider>
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-hidden">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
