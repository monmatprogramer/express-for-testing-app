FROM node:26-alpine AS build

WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci && npm cache clean --force

COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

