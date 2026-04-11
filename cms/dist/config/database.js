"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * - Local dev: SQLite file (DATABASE_FILENAME), same as before.
 * - Production: set DATABASE_URL (PostgreSQL). Data lives in the DB service, not on the app disk,
 *   so redeploys do not wipe content. Use Neon, Supabase, Render Postgres, etc.
 */
exports.default = ({ env, }) => {
    const databaseUrl = env("DATABASE_URL");
    if (databaseUrl) {
        const useSsl = env.bool("DATABASE_SSL", false);
        return {
            connection: {
                client: "postgres",
                connection: {
                    connectionString: databaseUrl,
                    ...(useSsl
                        ? {
                            ssl: {
                                rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false),
                            },
                        }
                        : {}),
                },
            },
        };
    }
    const raw = env("DATABASE_FILENAME", ".tmp/data.db");
    const filename = path_1.default.isAbsolute(raw)
        ? raw
        : path_1.default.join(process.cwd(), raw);
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
