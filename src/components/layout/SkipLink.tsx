/** First focusable element on every page; jumps past the header to <main id="main">. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-brutal bg-accent px-4 py-2 font-semibold text-on-accent no-underline shadow-brutal focus-ring border-brutal focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>
  );
}
