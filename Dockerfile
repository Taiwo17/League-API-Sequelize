FROM node:22-bookworm-slim AS base
WORKDIR /app

# install all dependencies and compile typescript
FROM base AS build 


COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

# Install only runtime dependencies
FROM base AS production-dependencies

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev


# for migration
FROM build AS migration

ENV NODE_ENV=production

COPY config/migrations.cjs ./config/migrations.cjs
COPY migrations/ ./migrations/

CMD ["npm", "run", "db:migrate"]

# final production image
FROM base AS production

ENV NODE_ENV=production PORT=4500

COPY --from=production-dependencies --chown=node:node \
    /app/node_modules ./node_modules

COPY --from=build --chown=node:node \
    /app/dist ./dist

COPY --chown=node:node package.json ./

USER node

EXPOSE 4500

STOPSIGNAL SIGTERM

CMD [ "node", "dist/server.js" ]

