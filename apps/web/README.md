# Next.js (public site)

Copy `.env.local.example` to `.env.local` and set the Strapi URL and API token (see root `README.md`).

### Why the browser Network tab shows no Strapi requests

Reference pages are rendered on the **Next.js server** (React Server Components). Requests to `http://localhost:1337/api/...` are made by the **Next Node process**, not the browser tab — so in **Network** you only see `localhost:3000`, not `1337`.

To verify Next is calling Strapi: watch the **Strapi terminal** (`GET /api/containers`) or add `DEBUG_STRAPI=1` to `.env.local` and check the **Next terminal** (`npm run dev` for `web`) for `[Strapi] GET http://...`.

Public routes:

- `/` — landing stub
- `/reference/container` — list (ISR, `revalidate: 60`)
- `/reference/container/[slug]` — container detail
- `/sitemap.xml`, `/robots.txt` — SEO
- `POST /api/revalidate` — on-demand revalidation (secret in `x-revalidate-secret` header)

For Strapi images, add your CMS hostname to `images.remotePatterns` in `next.config.ts` for production.
