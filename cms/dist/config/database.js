"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Keep SQLite outside `dist/`: after build `__dirname` is under `dist/config`,
 * so `../.tmp/data.db` would land in `dist/.tmp` (readonly DB / lost on dist clean).
 */
const config = ({ env, }) => {
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
exports.default = config;
