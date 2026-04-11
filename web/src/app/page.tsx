import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Справочник контейнеров
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Публичные страницы с размерами и описаниями типов контейнеров. Контент
        редактируется в Strapi; сайт на Next.js с ISR для SEO.
      </p>
      <Link
        href="/reference/container"
        className="mt-8 inline-flex w-fit rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Перейти к справочнику
      </Link>
    </main>
  );
}
