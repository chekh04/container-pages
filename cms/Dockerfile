FROM node:22-alpine AS base

RUN apk add --no-cache vips-dev


FROM base AS builder

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev bash git
RUN npm install -g node-gyp
WORKDIR /app

COPY package.json ./
RUN npm install
COPY . .
ENV NODE_ENV=production
RUN npm run build && mkdir -p public

FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/favicon.png ./favicon.png
COPY --from=builder /app/start.js ./start.js

RUN chown -R node:node /app
USER node
EXPOSE 1337
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
CMD wget --quiet --tries=1 --spider http://localhost:1337/_health || exit 1
CMD ["node", "start.js"]
