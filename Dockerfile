# Stage 1: Build
FROM node:26-alpine AS build
WORKDIR /app


# Install all packages (including heavy dev tools)
COPY packages.json packages-lock.json ./
RUN npm ci


# Copy code and build the application
COPY tsconfig.json prisma.config.ts ./
COPY prisma ./prisma


