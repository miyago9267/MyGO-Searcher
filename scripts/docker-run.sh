#!/bin/bash
user="mygo"
name="mygo-searcher"
port="12001"

run_env_args=()
if [ -f .env.production ]; then
    image_base_url=$(sed -n 's/^NUXT_IMG_BASE_URL=//p' .env.production | tail -n 1)
    if [ -n "$image_base_url" ]; then
        # Nuxt runtimeConfig maps this key to NUXT_NUXT_IMG_BASE_URL.
        run_env_args+=(--env "NUXT_NUXT_IMG_BASE_URL=$image_base_url")
    fi

    mongodb_connect_url=$(sed -n 's/^MONGODB_CONNECT_URL=//p' .env.production | tail -n 1)
    if [ -n "$mongodb_connect_url" ]; then
        # Nuxt runtimeConfig requires the NUXT_ prefix for runtime overrides.
        run_env_args+=(--env "NUXT_MONGODB_CONNECT_URL=$mongodb_connect_url")
    fi

    mongodb_collection=$(sed -n 's/^MONGODB_COLLECTION=//p' .env.production | tail -n 1)
    if [ -n "$mongodb_collection" ]; then
        run_env_args+=(--env "NUXT_MONGODB_COLLECTION=$mongodb_collection")
    fi
fi

docker build \
    $@ -t $user/$name:latest . || exit
[ "$(docker ps | grep $name)" ] && docker kill $name
[ "$(docker ps -a | grep $name)" ] && docker rm $name

docker run \
	-itd \
	-u $(id -u):$(id -g) \
	--name $name \
    --network bridge \
    --env-file .env.production \
    "${run_env_args[@]}" \
    -p $port:3000 \
	--restart=always \
	$user/$name:latest
