# Strapi CMS only — used by Railway (monorepo workspace build from repo root)
FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/cms/package.json ./apps/cms/
COPY apps/web/package.json ./apps/web/

RUN npm ci

COPY apps/cms ./apps/cms

RUN npm run build --workspace=cms

ENV NODE_ENV=production
ENV HOST=0.0.0.0

EXPOSE 1337

CMD ["npm", "run", "start", "--workspace=cms"]
