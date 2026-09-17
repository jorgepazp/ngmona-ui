# ── Stage 1: Build ──────────────────────────────────────────────────────────
# ui-kit is an npm workspace (packages/cli, packages/color) — copy every workspace's package.json
# before `npm ci` so the dependency layer stays cached across source-only changes.
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY packages/cli/package.json packages/cli/package.json
COPY packages/color/package.json packages/color/package.json
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────
# ui-kit is a client-only Angular SPA (no @angular/ssr, no server.ts — see angular.json, which has
# no `server` build option) built to dist/ui-kit/browser, so it's served as static files rather
# than run as a Node process.
FROM nginx:1.27-alpine

COPY --from=builder /app/dist/ui-kit/browser /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=4000
EXPOSE 4000
