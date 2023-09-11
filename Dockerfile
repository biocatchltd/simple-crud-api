# Stage 1: Build TypeScript app
FROM node:18.17.1-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

# Stage 2: Install production dependencies only
FROM node:18.17.1-bookworm-slim AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --omit=optional && npm cache clean --force

# Stage 3: Create production-ready image
FROM node:18.17.1-bookworm-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init


ENV NODE_ENV production
WORKDIR /app
EXPOSE 3000
COPY --chown=node:node --from=dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/package*.json ./
USER node

# Start the API application
CMD ["dumb-init", "node", "dist/main.js"]
