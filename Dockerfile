FROM node:26-alpine AS build

WORKDIR /app


COPY package.json package-lock.json ./


RUN npm ci && npm cache clean --force

COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

ARG DEFAULT_DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder
ENV DATABASE_URL=$DEFAULT_DATABASE_URL
RUN npx prisma contract emit && npm run build



FROM node:26-alpine as runtime
ENV NODE_ENV=production
ENV PORT=3000
