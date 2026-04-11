"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverConfig = ({ env, }) => ({
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    // Public URL of Strapi (https://your-strapi.onrender.com). Required for admin & media in production.
    url: env("PUBLIC_URL", "http://localhost:1337"),
    app: {
        keys: env.array("APP_KEYS", ["change-me-1", "change-me-2"]),
    },
});
exports.default = serverConfig;
