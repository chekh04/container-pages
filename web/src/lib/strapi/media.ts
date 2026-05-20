import type { StrapiMedia } from "./types";

export function pickMediaUrl(
  media: StrapiMedia | null | undefined,
): string | undefined {
  if (!media) return undefined;
  const m = media as StrapiMedia & {
    data?: { attributes?: { url?: string } };
  };
  if (typeof m.url === "string" && m.url.length) return m.url;
  const nested = m.data?.attributes?.url;
  if (typeof nested === "string") return nested;
  const fmt = m.formats?.large?.url ?? m.formats?.medium?.url;
  return typeof fmt === "string" ? fmt : undefined;
}

export function pickMediaList(
  media:
    | StrapiMedia[]
    | { data: StrapiMedia[] }
    | null
    | undefined,
): StrapiMedia[] {
  if (!media) return [];
  if (Array.isArray(media)) return media;
  if (Array.isArray(media.data)) return media.data;
  return [];
}
