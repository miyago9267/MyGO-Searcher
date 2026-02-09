#!/bin/bash
user="mygo"
name="mygo-searcher"
port="4001"

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
    -p $port:3000 \
	--restart=always \
	$user/$name:latest