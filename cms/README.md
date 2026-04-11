# Strapi (CMS)

## **Container** content type fields

| Field (API) | Type | Required | Purpose |
|-------------|------|------------|---------|
| `containerName` | string | yes | Name on card and in sidebar |
| `slug` | UID | yes | URL: `/reference/container/[slug]` (from `containerName`) |
| `containerDetailsPageTitle` | string | yes | H1 on detail page |
| `containerImage` | media (single image) | yes | Card image + OG |
| `insideLength` … `maxCargoWeight` | string | no | Dimensions (e.g. `12.024 m`, …) |
| `containerDescription` | **Blocks** | no | Description: headings, lists, links |
| `figures` | **media** (multiple) | no | Figures section — container photos |
| `usage` | **Blocks** | no | Usage section |
| `seoTitle` | string | yes | `<title>` and OG |
| `seoDescription` | text | yes | meta description |
| `learnMoreLabel` | string | no | Card CTA (site default: Learn more) |

All published containers appear in the list and sidebar; order on the site is by **`containerName`** (A→Z).

After schema changes, restart Strapi and **recreate entries** (or run a DB migration) if old fields no longer match.

### Lists in the admin (Bulleted / Numbered appear disabled)

In the **Blocks** editor, bulleted and numbered list toolbar buttons are **grey** when the selection spans **multiple blocks** (multiple paragraphs). The editor only applies lists to text **inside one** paragraph.

What to do:

1. Click **inside one paragraph** and select only its text — list buttons become active.
2. Or use the block type dropdown (left of the field) and choose **Bulleted list** / **Numbered list** to create a new list block.
3. Or at the start of a line type `- `, `*` or `1.` and a space — markdown-style list shortcuts.

On the **Next** site, list blocks from Blocks are already rendered (`StrapiBlocks` renders `list` / `list-item`).

## First run

1. Copy `.env.example` to `.env` and replace secrets with random strings.
2. From monorepo root: `npm install` (or `npm install` in this folder).
3. `npm run develop` from `apps/cms` or from root: `npm run dev:cms`.
4. Open `http://localhost:1337/admin` and create an admin user.
5. **Settings → Users & Permissions → Roles → Public** — for `container` enable `find` and `findOne`; for **Upload** — `find` (for images).
6. **Settings → API Tokens** — create a read-only token and put it in `apps/web/.env.local` as `STRAPI_API_TOKEN`.

### Entry not showing on the Next site

1. In Strapi the entry is **Published** (not only Save), status **Published**.
2. **Public** role has the permissions above.
3. In `apps/web/.env.local`: `STRAPI_URL=http://localhost:1337` (same host/port as Strapi). If `STRAPI_API_TOKEN` is set, the token must be allowed to read `container`.
4. Next caches responses for ~60s (ISR): wait a minute or restart `npm run dev` for web.
5. API check: `http://localhost:1337/api/containers?populate=*` — should return **200** and JSON with `data: [...]`. If **404**, the content type needs `routes/`, `controllers/`, `services/`.

### Favicon 500 in Strapi logs

There should be a `favicon.png` at `apps/cms` root (a minimal file is included in the repo).
