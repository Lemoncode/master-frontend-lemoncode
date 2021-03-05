FROM node:12-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Prepare static files
FROM base AS build-front
ARG BASE_API_URL
ENV BASE_API_URL=$BASE_API_URL
COPY ./ ./
RUN npm install
RUN npm run build

# Release
FROM base AS release
ENV STATIC_FILES_PATH=./public
COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package.json ./
COPY ./server/index.js ./
RUN npm install --only=production

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT [ "node", "index" ]
