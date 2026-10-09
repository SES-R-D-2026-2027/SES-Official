import { ErrorState } from "@/components/sections/shared/ErrorState";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Page not found",
  description: "This page doesn't exist on the SES website. Head back home to find your way.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      sticker="Lost?"
      title="This page wandered off"
      description="We couldn't find the page you were looking for. It may have moved, or the link might have a typo."
      note="happens to the best of us"
      actions={
        <Button href="/" arrow>
          Back to home
        </Button>
      }
    />
  );
}
