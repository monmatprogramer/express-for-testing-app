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


RUN addgroup -S app && adduser -S app -G app && chown  app:app


COPY --from=build --chown=app:app /app/package.json /app/package-lock.json ./

RUN npm ci --omit=dev \
&& npm install --no-save --package-lock=false @prisma/orm-postgres@8.0.0-rc.21 \
&& npm cache clean --force \
&& chown -R app:app node_modules


COPY --from=build --chown=app:app /app/dist ./dist
COPY --from=build --chown=app:app /app/src/prisma/contract.json ./dist/prisma/contract.json


USER app

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
CMD node e "fetch('http://127.0.0.1: '+process.env.PORT+'/api/v1/users/health ').then((r) => process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["node"]
CMD ["dist/server.js"]
