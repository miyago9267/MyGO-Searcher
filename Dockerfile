FROM oven/bun:latest AS build-stage

WORKDIR /app

COPY package.json bun.lock yarn.lock ./
RUN bun install

COPY . .
RUN bun run nuxt prepare \
  && bun run build

FROM node:22 AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.output ./

CMD ["node", "server/index.mjs"]
