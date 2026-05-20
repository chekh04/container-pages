import Image from "next/image";
import { absoluteMediaUrl } from "@/lib/seo/metadata";
import { pickMediaUrl } from "@/lib/strapi/media";
import type { ContainerEntity } from "@/lib/strapi/types";
import { DimensionList, type Row } from "@/components/SpecTable";

type Props = {
  container: ContainerEntity;
  specRows: Row[];
};

export function ContainerDetailHero({ container: c, specRows }: Props) {
  const imgPath = pickMediaUrl(c.containerImage);
  const imgSrc = imgPath ? absoluteMediaUrl(imgPath) : null;
  const hasDims = specRows.some((r) => r.value?.trim());

  return (
    <div
      className={
        hasDims
          ? "flex flex-col gap-8 md:flex-row md:items-stretch md:gap-10"
          : "flex flex-col"
      }
    >
      <div
        className={
          hasDims
            ? "relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 md:max-w-md md:flex-1"
            : "relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
        }
      >
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={c.containerName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 28rem"
            priority
          />
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-zinc-500">
            No image
          </div>
        )}
      </div>

      {hasDims ? (
        <div className="flex min-w-0 flex-1 flex-col justify-center md:py-1">
          <DimensionList rows={specRows} />
        </div>
      ) : null}
    </div>
  );
}
