FROM node:20.19.0 AS build-stage

WORKDIR /app

COPY package.json bun.lock yarn.lock ./

RUN npm install -g bun

RUN if [ -f ./bun.lock ]; then \
	bun install; \
	elif [ -f ./yarn.lock ]; then \
	yarn install; \
	else \
	npm install; \
	fi

COPY . .

RUN if [ -f ./bun.lock ]; then \
	bun run build; \
	elif [ -f ./yarn.lock ]; then \
	yarn build; \
	else \
	npm run build; \
	fi

FROM node:20.19.0-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/.output ./

CMD ["node", "server/index.mjs"]
