# Stage 1: Build
FROM node:26-alpine AS build
WORKDIR /app


# Install all packages (including heavy dev tools)
COPY package.json package-lock.json ./
RUN npm ci


# Copy code and build the application
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

ARG DEFAULT_DATABASE_URL=postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder
ENV DATABASE_URL=$DEFAULT_DATABASE_URL
RUN npx prisma contract emit && npm run build


# Delete havy develooper tools before moving to Stage 2
# 'npm prune' -> Docker deletes heavy develoment tools (like TypeScript) from node_modules
RUN npm prune --omit=dev && npm cache clean --force


# Stage 2: Runtime (Tiny and Clean)
FROM node:26-alpine AS runtime
ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app
RUN addgroup -S app && adduser -S app -G app && chown app:app /app


# Copy only the clean files from Stage 1.
COPY --from=build --chown=app:app /app/package.json ./
COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/dist ./dist


USER  app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+process.env.PORT+'/api/v1/users/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"


ENTRYPOINT ["node"]
CMD ["dist/server.js"]
