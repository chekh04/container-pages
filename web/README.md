# Next.js (публичный сайт)

Скопируйте `.env.local.example` в `.env.local` и укажите URL Strapi и API-токен (см. корневой `README.md`).

### Почему в браузере нет запросов к Strapi

Страницы справочника рендерятся на **сервере** Next (React Server Components). Запросы к `http://localhost:1337/api/...` делает **процесс Node с Next**, а не вкладка Chrome — поэтому в **Network** у страницы вы увидите только запросы к `localhost:3000`, без `1337`.

Чтобы убедиться, что Next ходит в Strapi: смотрите **терминал Strapi** (там появятся `GET /api/containers`) или добавьте в `.env.local` строку `DEBUG_STRAPI=1` и смотрите **терминал Next** (`npm run dev` для `web`) — появятся строки `[Strapi] GET http://...`.

Публичные маршруты:

- `/` — заглушка;
- `/reference/container` — список (ISR, `revalidate: 60`);
- `/reference/container/[slug]` — карточка контейнера;
- `/sitemap.xml`, `/robots.txt` — SEO;
- `POST /api/revalidate` — on-demand revalidation (секрет в заголовке `x-revalidate-secret`).

Для картинок из Strapi добавьте в `next.config.ts` свой `hostname` в `images.remotePatterns` (продакшен-домен CMS).
