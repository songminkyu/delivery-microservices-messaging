#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-gateway:latest -f ./apps/gateway/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-notification:latest -f ./apps/notification/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-order:latest -f ./apps/order/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-payment:latest -f ./apps/payment/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-product:latest -f ./apps/product/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t songminkyu/fc-nestjs-user:latest -f ./apps/user/Dockerfile --target production .

docker push songminkyu/fc-nestjs-gateway:latest
docker push songminkyu/fc-nestjs-notification:latest
docker push songminkyu/fc-nestjs-order:latest
docker push songminkyu/fc-nestjs-payment:latest
docker push songminkyu/fc-nestjs-product:latest
docker push songminkyu/fc-nestjs-user:latest