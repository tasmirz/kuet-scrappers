ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-alpine AS base
LABEL fly_launch_runtime="Node.js"
WORKDIR /app
ENV NODE_ENV="production"
FROM base AS build
RUN npm install -g pnpm
COPY package.json ./
RUN pnpm install
COPY . .
RUN pnpm build
RUN pnpm prune --prod
FROM node:${NODE_VERSION}-alpine
WORKDIR /app
ENV NODE_ENV="production"
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
USER node
EXPOSE 3000
CMD [ "node", "dist/index.js" ]
