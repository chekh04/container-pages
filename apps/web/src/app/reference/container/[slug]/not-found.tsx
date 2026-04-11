import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        This container type does not exist or the entry is not published yet.
      </p>
      <Link
        href="/reference/container"
        className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
      >
        Back to list
      </Link>
    </div>
  );
}
