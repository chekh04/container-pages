import { notFound } from "next/navigation";
import {
  getAllContainers,
  getContainerBySlug,
} from "@/lib/strapi/client";
import { buildContainerMetadata } from "@/lib/seo/metadata";
import { pickMediaList } from "@/lib/strapi/media";
import { containerSpecRows } from "@/components/SpecTable";
import { StrapiBlocks } from "@/components/StrapiBlocks";
import { FiguresGallery } from "@/components/FiguresGallery";
import { ContainerDetailHero } from "@/components/ContainerDetailHero";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const list = await getAllContainers();
    return list.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const c = await getContainerBySlug(slug);
  if (!c) return { title: "Not found" };
  return buildContainerMetadata(c);
}

const sectionTitle =
  "text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100";

export default async function ContainerDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = await getContainerBySlug(slug);
  if (!c) notFound();

  const specRows = containerSpecRows(c);
  const hasFigures = pickMediaList(c.figures ?? null).length > 0;
  const hasDescription =
    Array.isArray(c.containerDescription) && c.containerDescription.length > 0;
  const hasUsage = Array.isArray(c.usage) && c.usage.length > 0;

  return (
    <article className="space-y-10">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
        {c.containerDetailsPageTitle}
      </h1>

      <div className="space-y-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          {c.containerName}
        </h2>

        <ContainerDetailHero container={c} specRows={specRows} />

        {hasDescription ? (
          <section aria-labelledby="section-description">
            <h3 id="section-description" className={sectionTitle}>
              Description
            </h3>
            <div className="mt-4">
              <StrapiBlocks content={c.containerDescription} />
            </div>
          </section>
        ) : null}

        {hasFigures ? (
          <section aria-labelledby="section-figures">
            <h3 id="section-figures" className={sectionTitle}>
              Figures
            </h3>
            <div className="mt-4">
              <FiguresGallery figures={c.figures} />
            </div>
          </section>
        ) : null}

        {hasUsage ? (
          <section aria-labelledby="section-usage">
            <h3 id="section-usage" className={sectionTitle}>
              Usage
            </h3>
            <div className="mt-4">
              <StrapiBlocks content={c.usage} />
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
