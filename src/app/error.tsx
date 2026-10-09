"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { ErrorState } from "@/components/sections/shared/ErrorState";
import { Button } from "@/components/ui/Button";

// Route error boundary: renders inside the root layout (header + footer stay).
// Never show `error.message` to visitors; it can leak server details.
export default function ErrorPage({
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
    <>
      <title>Something went wrong · SES</title>
      <ErrorState
        code="oops"
        sticker="Bug!"
        color="coral"
        stickerColor="yellow"
        title="Something went wrong"
        description="A part of this page crashed while loading. Trying again usually fixes it; if not, head back home."
        note="we're on it, promise"
        actions={
          <>
            <Button
              onClick={() => retry()}
              icon={<RotateCcw aria-hidden="true" className="size-4" />}
            >
              Try again
            </Button>
            <Button href="/" variant="ghost">
              Back to home
            </Button>
          </>
        }
      />
    </>
  );
}
