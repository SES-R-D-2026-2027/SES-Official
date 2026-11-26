import { env } from "cloudflare:workers";

type MediaRouteContext = {
  params: Promise<{ key: string[] }>;
};

const ALLOWED_PREFIXES = ["v1/brand/", "v1/images/"] as const;
const CACHE_CONTROL = "public, max-age=31536000, immutable";

function validObjectKey(segments: string[]): string | null {
  if (segments.length < 2) return null;
  if (segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
    return null;
  }

  const key = segments.join("/");
  return ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix)) ? key : null;
}

function matchesEtag(request: Request, etag: string): boolean {
  const header = request.headers.get("if-none-match");
  if (!header) return false;
  return header.split(",").some((candidate) => candidate.trim() === "*" || candidate.trim() === etag);
}

function objectHeaders(object: R2Object): Headers {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("ETag", object.httpEtag);
  headers.set("Cache-Control", CACHE_CONTROL);
  headers.set("Content-Length", String(object.size));
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Content-Disposition", "inline");
  return headers;
}

export async function GET(request: Request, { params }: MediaRouteContext): Promise<Response> {
  const { key: segments } = await params;
  const key = validObjectKey(segments);
  if (!key) return new Response("Not found", { status: 404 });

  try {
    const object = await env.MEDIA.get(key);
    if (!object) {
      return new Response("Not found", {
        status: 404,
        headers: { "Cache-Control": "public, max-age=60", "X-Content-Type-Options": "nosniff" },
      });
    }

    const headers = objectHeaders(object);
    if (matchesEtag(request, object.httpEtag)) return new Response(null, { status: 304, headers });
    return new Response(object.body, { status: 200, headers });
  } catch (error) {
    console.error("[media] R2 read failed:", error);
    return new Response("Media service unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
}

export async function HEAD(_request: Request, { params }: MediaRouteContext): Promise<Response> {
  const { key: segments } = await params;
  const key = validObjectKey(segments);
  if (!key) return new Response(null, { status: 404 });

  try {
    const object = await env.MEDIA.head(key);
    if (!object) return new Response(null, { status: 404 });
    return new Response(null, { status: 200, headers: objectHeaders(object) });
  } catch (error) {
    console.error("[media] R2 metadata read failed:", error);
    return new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
