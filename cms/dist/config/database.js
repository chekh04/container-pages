"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Путь к SQLite должен быть вне `dist/`: при сборке `__dirname` указывает на
 * `dist/config`, и `../.tmp/data.db` превращался в `dist/.tmp/data.db` — оттуда
 * типичная ошибка «readonly database» и потеря БД при очистке dist.
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
