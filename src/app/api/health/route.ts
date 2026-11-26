import { env } from "cloudflare:workers";

/**
 * Lightweight backend health check. It verifies that the Worker can reach D1
 * without exposing schema details or database errors to public clients.
 */
export async function GET(): Promise<Response> {
  try {
    await env.DB.prepare("SELECT 1").first();

    return Response.json(
      {
        data: { status: "ok", database: "connected" },
        meta: { timestamp: new Date().toISOString() },
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[api/health] Database health check failed:", error);

    return Response.json(
      {
        error: {
          code: "DATABASE_UNAVAILABLE",
          message: "The service is temporarily unavailable.",
        },
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
