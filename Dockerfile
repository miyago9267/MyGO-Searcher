# Build stage
FROM node:18-alpine AS build-stage

## Set args, envs and workdir
ARG NPMRC_REGISTRY
ENV NPMRC_REGISTRY=${NPMRC_REGISTRY}
WORKDIR /app

## Install packages
COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
ENV NPMRC_NODE_LINKER=hoisted
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile

## Set production env
ENV NODE_ENV=production
## Copy files and build
COPY ./ ./
RUN pnpm run build

FROM node:18-alpine
# ENV NITRO_HOST=0.0.0.0
# ENV NITRO_PORT=8080
WORKDIR /app

RUN apk update && apk upgrade --no-cache
RUN apk add -lu --no-cache tzdata && ln -s /usr/share/zoneinfo/Asia/Taipei /etc/localtime

COPY --from=build-stage /app/.output ./
RUN echo "cd /app/server && node ./index.mjs" >entrypoint.sh
CMD ["sh", "entrypoint.sh"]
