import type { Core } from "@strapi/strapi";

/**
 * Users & Permissions JWT — must match `JWT_SECRET` in the environment.
 * In production Railway/Vercel, set `JWT_SECRET` to a long random string (e.g. `openssl rand -base64 32`).
 */
export default ({ env }: Core.Config.Shared.ConfigParams) => ({
  "users-permissions": {
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
});
