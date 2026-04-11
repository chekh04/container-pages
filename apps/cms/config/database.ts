import path from "path";
import type { Core } from "@strapi/strapi";

/**
 * - Local dev: SQLite file (DATABASE_FILENAME), same as before.
 * - Production: set DATABASE_URL (PostgreSQL). Data lives in the DB service, not on the app disk,
 *   so redeploys do not wipe content. Use Neon, Supabase, Render Postgres, etc.
 */
export default ({
  env,
}: Core.Config.Shared.ConfigParams) => {
  const databaseUrl = env("DATABASE_URL");

  if (databaseUrl) {
    const useSsl = env.bool("DATABASE_SSL", false);
    return {
      connection: {
        client: "postgres" as const,
        connection: {
          connectionString: databaseUrl,
          ...(useSsl
            ? {
                ssl: {
                  rejectUnauthorized: env.bool(
                    "DATABASE_SSL_REJECT_UNAUTHORIZED",
                    false,
                  ),
                },
              }
            : {}),
        },
      },
    };
  }

  const raw = env("DATABASE_FILENAME", ".tmp/data.db");
  const filename = path.isAbsolute(raw)
    ? raw
    : path.join(process.cwd(), raw);

  return {
    connection: {
      client: "sqlite" as const,
      connection: {
        filename,
      },
      useNullAsDefault: true,
    },
  };
};
