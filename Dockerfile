FROM node:26-alpine AS build

WORKDIR /app


COPY package.json package-lock.json ./
