#!/bin/sh

docker build -t owsugo .

docker ps | grep owsugo
if [ $? = 0 ] ; then
	docker stop owsugo
	docker rm owsugo
fi;

docker run \
	--name owsugo \
	-p 3000:3000 \
	-d \
	owsugo
