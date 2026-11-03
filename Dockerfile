FROM node:26-alpine AS build

WORKDIR /app


COPY package.json package-lock.json ./

FROM

RUN npm ci && npm cache clean --force

