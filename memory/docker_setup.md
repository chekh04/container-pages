---
name: docker-setup
description: Working Docker build strategy for CMS (Strapi) and web (Next.js) — Alpine + vips-dev, lockfile-free npm install
metadata:
  type: project
---

# Docker build strategy

Both images build and run successfully with `docker compose up --build`.

## CMS Dockerfile key decisions

**Base image**: `node:22-alpine` (both builder and runner) — matches official Strapi docs.

**`vips-dev` installed in base**: `sharp` uses system libvips via `vips-dev` so it needs no pre-built platform binary. This is the official Strapi-recommended fix.

**No package-lock.json in Docker**: The lockfile was generated on macOS, which locks macOS platform binaries for `@swc/core`, `rollup`, `sharp`, `better-sqlite3`, etc. Using only `package.json` with `npm install` lets npm resolve the correct Alpine/musl binaries. All package versions are pinned (no `^`) in `package.json`, so reproducibility is maintained without the lockfile.

**Builder stage**: installs `build-base gcc autoconf automake zlib-dev libpng-dev bash git` + `node-gyp` globally for native module compilation.

**Runner stage**: `npm install --omit=dev` (no lockfile) so `sharp`, `better-sqlite3`, `pg` get their correct Alpine binaries.

**`start.js`**: Strapi is started via `node start.js` which calls `createStrapi({ distDir: path.join(process.cwd(), 'dist') }).start()`. This bypasses Strapi's `isUsingTypeScript()` check (which looks for `tsconfig.json` — not present in the runner) and ensures it finds compiled output in `dist/`.

**Healthcheck**: `wget --quiet --tries=1 --spider http://localhost:1337/_health`

## Web Dockerfile

Uses `node:22-alpine` with `npm ci` + `npm install @swc/core` (explicit swc re-install for Alpine binary). Next.js standalone output mode.

## Why `npm install` not `npm ci`

`npm ci` strictly follows the lockfile — it will install `@swc/core-darwin-arm64` (or whichever macOS binary is recorded) and skip the Linux binary. `npm install` without a lockfile resolves optional platform deps fresh for the current platform.

**Why:** Hit a multi-hour debugging session where `@swc/core`, `rollup`, and `sharp` all failed with "native binding not found" when using `npm ci` with a macOS-generated lockfile.
**How to apply:** Never use `npm ci` in Docker when the lockfile was generated on a different OS/arch than the build target. Use `npm install` with only `package.json`, relying on pinned versions for reproducibility.
