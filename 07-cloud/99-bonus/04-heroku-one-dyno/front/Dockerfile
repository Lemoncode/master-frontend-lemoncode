FROM node:20-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Prepare static files
FROM base AS build-front
ARG BASE_API_URL
ENV PUBLIC_BASE_API_URL=$BASE_API_URL
COPY ./ ./
RUN npm ci
RUN npm run build

# Release
FROM base AS release
ENV STATIC_FILES_PATH=./public
COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package.json ./
COPY ./server/package-lock.json ./
COPY ./server/index.js ./
RUN npm ci --omit=dev

ENV PORT=8080
CMD node index.js
