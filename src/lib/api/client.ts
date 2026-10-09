import { z } from "zod";
import type { ApiSuccess } from "@/types/content";

// Fetch wrapper for ses-api. Unwraps the { data, meta } envelope and turns every failure
// (network, non-2xx, malformed body) into an ApiError with a clear code.

export type ApiErrorCode =
  | "NETWORK_ERROR"
  | "INVALID_RESPONSE"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | (string & {}); // codes sent by ses-api pass through unchanged

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, status = 0, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

const successSchema = z.object({
  data: z.unknown(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
});

/** Server code uses API_URL; browser code (forms) only sees NEXT_PUBLIC_API_URL. */
export function getApiBaseUrl(): string {
  const base =
    typeof window === "undefined"
      ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL)
      : process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new ApiError("CONFIG_ERROR", "API base URL is not set (API_URL / NEXT_PUBLIC_API_URL).");
  }
  return base.replace(/\/+$/, "");
}

function codeForStatus(status: number): ApiErrorCode {
  if (status === 404) return "NOT_FOUND";
  if (status === 400 || status === 422) return "VALIDATION_ERROR";
  if (status === 429) return "RATE_LIMITED";
  return "SERVER_ERROR";
}

/**
 * Call ses-api and return the unwrapped envelope.
 * @param path e.g. "/api/public/events?timeline=upcoming"
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiSuccess<T>> {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: { Accept: "application/json", ...init?.headers },
    });
  } catch (cause) {
    throw new ApiError("NETWORK_ERROR", `Could not reach ses-api at ${url}`, 0, cause);
  }

  // 201/204 from POST endpoints may have no body.
  const text = await res.text();
  let body: unknown = undefined;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      throw new ApiError("INVALID_RESPONSE", `ses-api returned non-JSON for ${path}`, res.status);
    }
  }

  if (!res.ok) {
    const parsed = errorSchema.safeParse(body);
    if (parsed.success) {
      const { code, message, details } = parsed.data.error;
      throw new ApiError(code, message, res.status, details);
    }
    throw new ApiError(codeForStatus(res.status), `ses-api ${res.status} for ${path}`, res.status);
  }

  if (body === undefined) return { data: undefined as T };

  const parsed = successSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError("INVALID_RESPONSE", `ses-api response for ${path} has no "data" field`);
  }
  return parsed.data as ApiSuccess<T>;
}

/** POST JSON (contact / join forms). */
export function apiPost<T>(path: string, payload: unknown): Promise<ApiSuccess<T>> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
