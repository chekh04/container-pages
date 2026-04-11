"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ContainerEntity } from "@/lib/strapi/types";

type Props = {
  items: ContainerEntity[];
};

export function ContainerSidebar({ items }: Props) {
  const pathname = usePathname();
  const segment = pathname?.split("/").filter(Boolean).pop();

  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav aria-label="Типы контейнеров" className="sticky top-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Контейнеры
        </p>
        <ul className="space-y-1 border-l border-zinc-200 pl-3 dark:border-zinc-700">
          {items.map((item) => {
            const active = segment === item.slug;
            return (
              <li key={item.documentId ?? item.id}>
                <Link
                  href={`/reference/container/${item.slug}`}
                  className={
                    active
                      ? "block rounded-r-md bg-zinc-100 py-1.5 pl-2 text-sm font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "block rounded-r-md py-1.5 pl-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100"
                  }
                >
                  {item.containerName}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
