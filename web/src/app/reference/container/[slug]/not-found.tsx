import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Страница не найдена</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Такого типа контейнера нет или запись ещё не опубликована.
      </p>
      <Link
        href="/reference/container"
        className="mt-6 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
      >
        Вернуться к списку
      </Link>
    </div>
  );
}
