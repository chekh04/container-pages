import Image from "next/image";
import { absoluteMediaUrl } from "@/lib/seo/metadata";
import { pickMediaList, pickMediaUrl } from "@/lib/strapi/media";
import type { ContainerEntity } from "@/lib/strapi/types";

type Props = {
  figures: ContainerEntity["figures"];
};

export function FiguresGallery({ figures }: Props) {
  const items = pickMediaList(figures ?? null);
  if (!items.length) return null;

  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
      {items.map((m) => {
        const src = absoluteMediaUrl(pickMediaUrl(m));
        if (!src) return null;
        const alt = m.alternativeText?.trim() || "Container";
        return (
          <figure
            key={m.documentId ?? m.id}
            className="relative h-52 w-72 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="288px"
            />
          </figure>
        );
      })}
    </div>
  );
}
