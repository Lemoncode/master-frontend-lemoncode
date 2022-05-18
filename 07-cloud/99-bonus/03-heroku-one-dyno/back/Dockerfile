FROM node:16-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Build front
FROM base AS build-front
ARG BASE_API_URL
ENV BASE_API_URL=$BASE_API_URL
ARG FRONT_PATH
COPY $FRONT_PATH ./
RUN npm ci
RUN npm run build

# Build backend
FROM base AS build-backend
COPY ./ ./
RUN npm ci
RUN npm run build

# Release
FROM base AS release
ENV STATIC_FILES_PATH=./public
COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY --from=build-backend /usr/app/dist ./
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci --only=production

ENTRYPOINT [ "node", "index" ]
