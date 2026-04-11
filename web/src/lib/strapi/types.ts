import type { StrapiBlocksJson } from "@/lib/strapi/render-blocks";

export type StrapiSingle<T> = {
  data: T | null;
  meta?: Record<string, unknown>;
};

export type StrapiCollection<T> = {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type StrapiMedia = {
  id: number;
  documentId: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, { url: string }>;
};

export type ContainerAttributes = {
  containerName: string;
  slug: string;
  containerDetailsPageTitle: string;
  containerImage?: StrapiMedia | null;
  insideLength?: string | null;
  insideWidth?: string | null;
  insideHeight?: string | null;
  doorWidth?: string | null;
  doorHeight?: string | null;
  capacity?: string | null;
  tareWeight?: string | null;
  maxCargoWeight?: string | null;
  containerDescription?: StrapiBlocksJson;
  figures?: StrapiMedia[] | { data: StrapiMedia[] } | null;
  usage?: StrapiBlocksJson;
  seoTitle: string;
  seoDescription: string;
  learnMoreLabel?: string | null;
};

export type ContainerEntity = {
  id: number;
  documentId: string;
} & ContainerAttributes;
