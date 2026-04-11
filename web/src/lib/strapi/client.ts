import type { ContainerEntity, StrapiCollection } from "./types";

const STRAPI_URL = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

function strapiLoggingEnabled() {
  if (process.env.STRAPI_LOGGING === "0") return false;
  return (
    process.env.DEBUG_STRAPI === "1" ||
    process.env.DEBUG_STRAPI === "true" ||
    process.env.NODE_ENV === "development"
  );
}

function logStrapiRequest(method: string, url: string) {
  if (!strapiLoggingEnabled()) return;
  console.info(`[Strapi] → ${method} ${url}`);
}

function logStrapiOk(url: string, status: number, json: unknown) {
  if (!strapiLoggingEnabled()) return;
  if (
    json &&
    typeof json === "object" &&
    "data" in json &&
    Array.isArray((json as StrapiCollection<unknown>).data)
  ) {
    const n = (json as StrapiCollection<unknown>).data.length;
    console.info(`[Strapi] ← ${status} OK`, { url, items: n });
    return;
  }
  console.info(`[Strapi] ← ${status} OK`, { url, body: "non-list response" });
}

function logStrapiError(url: string, status: number, body: string) {
  console.error(`[Strapi] ← ${status}`, { url, body: body.slice(0, 1200) });
  if (status === 403) {
    console.error(
      "[Strapi] 403 Forbidden: enable find and findOne for Container (and upload find for images) under Settings → Users & Permissions → Roles → Public.",
    );
  }
}

function buildHeaders(): HeadersInit {
  const h: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (STRAPI_TOKEN) {
    h.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }
  return h;
}

async function strapiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!STRAPI_URL) {
    throw new Error("STRAPI_URL is not set");
  }
  const url = `${STRAPI_URL.replace(/\/$/, "")}/api${path}`;
  logStrapiRequest(init?.method ?? "GET", url);
  const res = await fetch(url, {
    ...init,
    headers: { ...buildHeaders(), ...init?.headers },
    next: init?.next,
  });
  if (!res.ok) {
    const text = await res.text();
    logStrapiError(url, res.status, text);
    throw new Error(`Strapi ${res.status}: ${text.slice(0, 500)}`);
  }
  const json = (await res.json()) as T;
  logStrapiOk(url, res.status, json);
  return json;
}

function containersQuery(extra: Record<string, string> = {}) {
  const qs = new URLSearchParams({
    populate: "*",
    sort: "containerName:asc",
    ...extra,
  });
  return qs.toString();
}

export async function getContainersForNav(): Promise<ContainerEntity[]> {
  const qs = containersQuery();
  const data = await strapiFetch<StrapiCollection<ContainerEntity>>(
    `/containers?${qs}`,
    { next: { revalidate: 60, tags: ["containers"] } },
  );
  return data.data ?? [];
}

export async function getAllContainers(): Promise<ContainerEntity[]> {
  const qs = containersQuery({
    "pagination[pageSize]": "100",
  });
  const data = await strapiFetch<StrapiCollection<ContainerEntity>>(
    `/containers?${qs}`,
    { next: { revalidate: 60, tags: ["containers"] } },
  );
  return data.data ?? [];
}

export async function getContainerBySlug(
  slug: string,
): Promise<ContainerEntity | null> {
  const qs = new URLSearchParams({
    populate: "*",
    "filters[slug][$eq]": slug,
  });
  const data = await strapiFetch<StrapiCollection<ContainerEntity>>(
    `/containers?${qs.toString()}`,
    { next: { revalidate: 60, tags: [`container-${slug}`] } },
  );
  return data.data?.[0] ?? null;
}
