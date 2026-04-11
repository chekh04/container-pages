import Link from "next/link";
import { getContainersForNav } from "@/lib/strapi/client";
import { ContainerSidebar } from "@/components/ContainerSidebar";

export const revalidate = 60;

export default async function ReferenceContainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let navItems: Awaited<ReturnType<typeof getContainersForNav>> = [];
  try {
    navItems = await getContainersForNav();
  } catch {
    navItems = [];
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 md:px-6">
      <header className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          На главную
        </Link>
        <span className="text-zinc-300 dark:text-zinc-600" aria-hidden>
          /
        </span>
        <Link
          href="/reference/container"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          Справочник контейнеров
        </Link>
      </header>

      <div className="flex flex-col gap-8 md:flex-row md:gap-12">
        <ContainerSidebar items={navItems} />
        <main className="main-body min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
