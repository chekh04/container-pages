"use client";

import {
  RenderStrapiBlocks,
  type StrapiBlocksJson,
} from "@/lib/strapi/render-blocks";

type Props = {
  content: StrapiBlocksJson;
  className?: string;
};

export function StrapiBlocks({ content, className }: Props) {
  if (!content || !Array.isArray(content) || content.length === 0) {
    return null;
  }

  return (
    <div
      className={
        className ??
        "prose prose-zinc max-w-3xl dark:prose-invert prose-headings:scroll-mt-20 prose-ul:list-disc prose-ol:list-decimal prose-a:text-blue-700 dark:prose-a:text-blue-300"
      }
    >
      <RenderStrapiBlocks content={content} />
    </div>
  );
}
