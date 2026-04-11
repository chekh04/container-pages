import path from "path";
import type { Core } from "@strapi/strapi";

/**
 * Путь к SQLite должен быть вне `dist/`: при сборке `__dirname` указывает на
 * `dist/config`, и `../.tmp/data.db` превращался в `dist/.tmp/data.db` — оттуда
 * типичная ошибка «readonly database» и потеря БД при очистке dist.
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
