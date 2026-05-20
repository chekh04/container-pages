import { ContainerCard } from "@/components/ContainerCard";
import { getContainersForNav } from "@/lib/strapi/client";

export const revalidate = 60;

export default async function ContainerIndexPage() {
  let items: Awaited<ReturnType<typeof getContainersForNav>> = [];
  try {
    items = await getContainersForNav();
  } catch {
    items = [];
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Container dimensions
      </h1>
      <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
        Shipping container sizes and types. Content is managed in Strapi; all
        published entries appear here and in the sidebar.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
          No published containers yet. Add entries in Strapi (Container), enable
          Public API permissions, and publish.
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c) => (
            <li key={c.documentId ?? c.id}>
              <ContainerCard container={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
