import type { Metadata } from "next";
import type { ContainerEntity } from "@/lib/strapi/types";
import { pickMediaUrl } from "@/lib/strapi/media";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

const strapiPublic =
  process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "") ?? "";

export function absoluteMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (!strapiPublic) return undefined;
  return `${strapiPublic}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function buildContainerMetadata(
  c: ContainerEntity,
): Metadata {
  const title = c.seoTitle?.trim() || c.containerName;
  const description = c.seoDescription?.trim() || undefined;
  const canonical = `${siteUrl}/reference/container/${c.slug}`;
  const og = absoluteMediaUrl(pickMediaUrl(c.containerImage));

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      ...(og ? { images: [{ url: og }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(og ? { images: [og] } : {}),
    },
  };
}

export function siteMetadata(): Metadata {
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "Container reference",
      template: "%s · Container reference",
    },
    description:
      "Shipping container types and dimensions: standard, refrigerated, and more.",
  };
}
