"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { ErrorState } from "@/components/sections/shared/ErrorState";
import { Button, buttonVariants } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { fontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

// Last-resort fallback when the root layout itself fails. It replaces the layout, so it
// renders its own <html>/<body> and skips Header, Footer and MotionProvider (they may be
// what broke). Never show `error.message` to visitors.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" data-theme={siteConfig.theme} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <title>{`Something went wrong · ${siteConfig.shortName}`}</title>
        <main id="main" className="flex flex-1 flex-col">
          <ErrorState
            code="500"
            sticker="Uh oh"
            color="coral"
            stickerColor="yellow"
            animated={false}
            title="The site hit a snag"
            description="Something broke on our side and the page couldn't load. Try again, or come back in a little while."
            actions={
              <>
                <Button
                  onClick={() => retry()}
                  icon={<RotateCcw aria-hidden="true" className="size-4" />}
                >
                  Try again
                </Button>
                {/* Plain <a> on purpose: a full reload resets whatever broke the layout. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/" className={buttonVariants({ variant: "ghost" })}>
                  Back to home
                </a>
              </>
            }
          />
        </main>
      </body>
    </html>
  );
}
