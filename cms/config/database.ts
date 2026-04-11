import path from "path";
import type { Core } from "@strapi/strapi";

/**
 * Keep SQLite outside `dist/`: after build `__dirname` is under `dist/config`,
 * so `../.tmp/data.db` would land in `dist/.tmp` (readonly DB / lost on dist clean).
 */
const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Database<"sqlite"> => {
  const raw = env("DATABASE_FILENAME", ".tmp/data.db");
  const filename = path.isAbsolute(raw)
    ? raw
    : path.join(process.cwd(), raw);

  return {
    connection: {
      client: "sqlite",
      connection: {
        filename,
      },
      useNullAsDefault: true,
    },
  };
};

export default config;
