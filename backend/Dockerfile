# syntax=docker/dockerfile:1
# Build from the repo root: `docker build -f backend/Dockerfile .`
FROM node:22.21.1-bookworm-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="${PNPM_HOME}:${PATH}"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@11.15.1 --activate
WORKDIR /app

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc .node-version ./
COPY backend/package.json backend/package.json
COPY core-modules/package.json core-modules/package.json
COPY web/package.json web/package.json
COPY mobile/package.json mobile/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY tsconfig.json ./
COPY core-modules core-modules
COPY backend backend
RUN pnpm --filter @pairkit/core build \
  && pnpm --filter backend exec prisma generate \
  && pnpm --filter backend build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app /app
COPY backend/scripts/docker-entrypoint.sh /app/backend/scripts/docker-entrypoint.sh
RUN chmod +x /app/backend/scripts/docker-entrypoint.sh
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/live').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
ENTRYPOINT ["/app/backend/scripts/docker-entrypoint.sh"]
