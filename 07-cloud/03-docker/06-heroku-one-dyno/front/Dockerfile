FROM node:12-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Prepare static files
FROM base AS build-front
COPY ./ ./
RUN npm install
RUN npm run build

# Release
FROM base AS release
COPY --from=build-front /usr/app/dist ./public
COPY ./server/package.json ./
COPY ./server/index.js ./
RUN npm install --only=production

ENV PORT=8000
ENV STATIC_FILES_PATH=./public

EXPOSE 8000
ENTRYPOINT [ "node", "index" ]
