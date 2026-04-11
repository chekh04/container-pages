import Image from "next/image";
import Link from "next/link";
import type { ContainerEntity } from "@/lib/strapi/types";
import { absoluteMediaUrl } from "@/lib/seo/metadata";
import { pickMediaUrl } from "@/lib/strapi/media";

type Props = {
  container: ContainerEntity;
};

export function ContainerCard({ container: c }: Props) {
  const imgPath = pickMediaUrl(c.containerImage);
  const imgSrc = absoluteMediaUrl(imgPath);
  const cta = (c.learnMoreLabel?.trim() || "Learn more").toUpperCase();

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <Link
        href={`/reference/container/${c.slug}`}
        className="group flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
      >
        <div className="relative aspect-[4/3] w-full bg-zinc-100 dark:bg-zinc-800">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={c.containerName}
              fill
              className="object-cover transition group-hover:opacity-95"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              No image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
            {c.containerName}
          </h2>
          <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {cta}
          </span>
        </div>
      </Link>
    </article>
  );
}
