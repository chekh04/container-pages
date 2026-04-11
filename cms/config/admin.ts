import type { Core } from "@strapi/strapi";

const adminConfig = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env("ADMIN_JWT_SECRET", "dev-admin-secret-change-me"),
  },
  apiToken: {
    salt: env("API_TOKEN_SALT", "dev-api-token-salt-change-me"),
  },
  transfer: {
    token: {
      salt: env("TRANSFER_TOKEN_SALT", "dev-transfer-salt-change-me"),
    },
  },
  flags: {
    nps: env.bool("FLAG_NPS", true),
    promoteEE: env.bool("FLAG_PROMOTE_EE", true),
  },
});

export default adminConfig;
