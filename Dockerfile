# Stage 1: 
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


# Stage 2:
FROM node:26-alpine AS runtim
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app


RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app


COPY --from=build --chown=app:app /app/package.json /app/package-lock.json ./

RUN npm ci --omit=dev  && npm cache clean --force

COPY --from=build --chown=app:app /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=app:app /app/dist ./dis
COPY --from=build --chown=app:app /app/prisma ./prisma

EXPOSE $PORT

CMD["node", "dist/server.js"]
