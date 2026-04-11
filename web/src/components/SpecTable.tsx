export type Row = { label: string; value?: string | null };

type Props = {
  rows: Row[];
};

/** Секция деталей: «название — значение», по одному на строку. */
export function DimensionList({ rows }: Props) {
  const visible = rows.filter((r) => r.value?.trim());
  if (!visible.length) return null;

  return (
    <ul className="space-y-2.5 text-sm">
      {visible.map((row) => (
        <li
          key={row.label}
          className="flex justify-between flex-wrap items-baseline gap-x-2 gap-y-0.5 text-zinc-800 dark:text-zinc-200"
        >
          <span className="font-semibold uppercase text-zinc-600 dark:text-zinc-400">
            {row.label}:
          </span>
          <span className="min-w-0 break-words">{row.value}</span>
        </li>
      ))}
    </ul>
  );
}

export function SpecTable({ rows }: Props) {
  const visible = rows.filter((r) => r.value?.trim());
  if (!visible.length) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="w-full text-left text-sm">
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {visible.map((row) => (
            <tr key={row.label}>
              <th
                scope="row"
                className="w-2/5 bg-zinc-50 px-4 py-2 font-medium text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400"
              >
                {row.label}
              </th>
              <td className="px-4 py-2 text-zinc-900 dark:text-zinc-100">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function containerSpecRows(c: {
  insideLength?: string | null;
  insideWidth?: string | null;
  insideHeight?: string | null;
  doorWidth?: string | null;
  doorHeight?: string | null;
  capacity?: string | null;
  tareWeight?: string | null;
  maxCargoWeight?: string | null;
}): Row[] {
  return [
    { label: "Inside length", value: c.insideLength },
    { label: "Inside width", value: c.insideWidth },
    { label: "Inside height", value: c.insideHeight },
    { label: "Door width", value: c.doorWidth },
    { label: "Door height", value: c.doorHeight },
    { label: "Capacity", value: c.capacity },
    { label: "Tare weight", value: c.tareWeight },
    { label: "Max cargo weight", value: c.maxCargoWeight },
  ];
}
