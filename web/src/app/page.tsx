import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">
        Container reference
      </h1>
      <p className="mt-4 text-zinc-600 dark:text-zinc-400">
        Public pages with dimensions and descriptions for container types. Content
        is edited in Strapi; the site runs on Next.js with ISR for SEO.
      </p>
      <Link
        href="/reference/container"
        className="mt-8 inline-flex w-fit rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Go to reference
      </Link>
    </main>
  );
}
