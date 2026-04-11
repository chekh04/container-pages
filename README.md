# container-pages

Monorepo: public site on **Next.js** (ISR, SEO) + **Strapi** (admin and content).

## Requirements

- Node.js 18.18+ (20 LTS recommended)
- npm 9+

## Setup

From the repository root:

```bash
npm install
```

On first Strapi run it will create the SQLite file and prompt you to create an admin user in the browser.

## Environment variables

### `apps/cms/.env`

Copy `apps/cms/.env.example` to `apps/cms/.env` and set:

- `APP_KEYS` — e.g. `openssl rand -base64 32` (comma-separated for multiple)
- `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET` — random strings

### `apps/web/.env.local`

Copy `apps/web/.env.local.example` to `apps/web/.env.local`:

- `STRAPI_URL` — Strapi URL (e.g. `http://localhost:1337`)
- `STRAPI_API_TOKEN` — read-only API token (Strapi: Settings → API Tokens → Read-only)
- `NEXT_PUBLIC_STRAPI_URL` — same public URL (for media URLs)
- `REVALIDATE_SECRET` — secret for ISR webhook (matches Strapi webhook payload/header)

## Development

Terminal 1 — CMS:

```bash
npm run dev:cms
```

Admin: `http://localhost:1337/admin`

Terminal 2 — site:

```bash
npm run dev:web
```

Site: `http://localhost:3000`

### API permissions (important)

In Strapi: **Settings → Users & Permissions → Roles → Public** — enable for `container`: `find` and `findOne` (and `find` for `upload` if needed for images).

### Webhook for instant ISR (optional)

In Strapi: **Settings → Webhooks** — URL: `https://your-domain/api/revalidate`, header `x-revalidate-secret: <REVALIDATE_SECRET>`, events: Entry create/update/delete for Container.

## Build

```bash
npm run build:web
npm run build:cms
```

## Structure

- `apps/web` — Next.js (App Router), `/reference/container`, sitemap, robots, revalidate
- `apps/cms` — Strapi, **Container** content type, drafts/publish

## Deployment (Supabase DB + Strapi + Next)

**Order:** (1) Supabase Postgres is ready. (2) Deploy **Strapi**, note its public `https://…` URL. (3) Deploy **Next** with env pointing at that URL.

### Railway (Strapi) + Vercel (Next)

**Strapi on [Railway](https://railway.app)**

The repo includes a root **`Dockerfile`** so Railway uses **Docker** instead of Railpack (Railpack often fails on monorepos). No extra Railway build settings required unless you override them.

1. New project → **Deploy from GitHub** → pick this repo.
2. Railway should detect **`Dockerfile`** at the repo root and build/start automatically.
3. If a deploy still uses Railpack, open the service → **Settings** → set **Builder** to **Dockerfile** (or remove custom build overrides).
4. **Settings** (if needed):
   - **Root directory:** empty (repo root).
   - Do **not** set a custom build/start command unless you know you need it — the Dockerfile already runs `npm run build --workspace=cms` and `npm run start --workspace=cms`.
5. **Variables** tab — add everything from the **Environment (production)** table below (Supabase `DATABASE_URL`, `DATABASE_SSL=true`, `APP_KEYS`, JWT secrets, etc.).
6. **Networking → Public networking → Generate domain** (or attach your domain). Copy the `https://…` URL.
7. Add **`PUBLIC_URL`** = that exact `https://…` URL (Railway does not set this for you).
8. Railway injects **`PORT`** — already read by Strapi (`config/server.ts`).

**Next on [Vercel](https://vercel.com)**

1. Import the **same** Git repo → project for the **web** app.
2. **Root Directory:** `apps/web`
3. **Install Command:** `cd ../.. && npm install` (installs the monorepo from the repo root).
4. **Build Command:** `cd ../.. && npm run build --workspace=web`
5. **Output / Framework:** Next.js (default).
6. **Environment variables** — `STRAPI_URL`, `NEXT_PUBLIC_STRAPI_URL` = Railway Strapi URL; `NEXT_PUBLIC_SITE_URL` = your Vercel URL (`https://….vercel.app` or custom domain); `STRAPI_API_TOKEN`, `REVALIDATE_SECRET`, etc.

Redeploy Vercel once Strapi has a stable public URL. Optional: Strapi webhook → `https://<your-vercel-domain>/api/revalidate`.

### Strapi (e.g. [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io))

- **Root directory:** repo root (or `apps/cms` if the host only clones that folder).
- **Build:** from repo root: `npm install && npm run build --workspace=cms` (install must run so workspace deps resolve).
- **Start:** `npm run start --workspace=cms` (or `cd apps/cms && npm start`).
- **Node:** 18–22.

**Environment (production):**

| Variable | Example |
|----------|---------|
| `DATABASE_URL` | Supabase **Session pooler** URI |
| `DATABASE_SSL` | `true` |
| `PUBLIC_URL` | `https://your-cms.onrender.com` (exact public URL of Strapi) |
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET` | Strong random values (do not reuse dev secrets). **`JWT_SECRET` is required** — without it Strapi throws *Missing jwtSecret* in production. |
| `HOST` | `0.0.0.0` |
| `PORT` | Usually set by platform (e.g. Render injects `PORT`) |

**Uploads:** Strapi stores files under `public/uploads` on the server disk. On most PaaS that disk is **ephemeral** — uploads can disappear on redeploy. For production, plan **Supabase Storage**, S3, or a **persistent disk** on the host.

### Next.js (e.g. [Vercel](https://vercel.com))

- **Root directory:** `apps/web` **or** monorepo root with install/build commands below.
- **Install:** `cd ../.. && npm install` (from `apps/web` use `cd .. && cd ..` to repo root) or set install at root.
- **Build:** `cd ../.. && npm run build --workspace=web` if root is `apps/web`; if root is repo root: `npm install && npm run build --workspace=web`.
- **Output:** Next default (no static export).

**Environment:**

| Variable | Value |
|----------|--------|
| `STRAPI_URL` | Same as public Strapi base URL (`https://…`) |
| `NEXT_PUBLIC_STRAPI_URL` | Same (used for `next/image` and media URLs) |
| `NEXT_PUBLIC_SITE_URL` | Your live site `https://…` |
| `STRAPI_API_TOKEN` | Read-only token from Strapi admin |
| `REVALIDATE_SECRET` | Random string; use in Strapi webhook header `x-revalidate-secret` |

**`next.config.ts`:** add your Strapi host to `images.remotePatterns` if it is not `localhost` (already supports env-based hostname).

### After deploy

1. Open Strapi admin on the **HTTPS** URL, confirm login.
2. **Settings → API Tokens** — create token for Next if needed.
3. **Settings → Users & Permissions → Public** — `find` / `findOne` on `container`, `find` on `upload` for images.
4. Optional: Strapi **Webhooks** → `POST https://your-site.vercel.app/api/revalidate` with header `x-revalidate-secret` and Container events.
