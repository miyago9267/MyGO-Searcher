FROM node:20.19.5 AS build-stage

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn nuxt prepare \
  && yarn build

FROM node:20.19.5 AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.output ./

CMD ["node", "server/index.mjs"]
