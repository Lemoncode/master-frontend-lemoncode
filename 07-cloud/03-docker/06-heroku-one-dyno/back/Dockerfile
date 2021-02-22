FROM node:12-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Build front
FROM base AS build-front
ARG BASE_API_URL
ENV BASE_API_URL=$BASE_API_URL
ARG FRONT_PATH
COPY $FRONT_PATH ./
RUN npm install
RUN npm run build

# Build backend
FROM base AS build-backend
COPY ./ ./
RUN npm install
RUN npm run build

# Release
FROM base AS release
ENV STATIC_FILES_PATH=./public
COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY --from=build-backend /usr/app/dist ./
COPY ./package.json ./
RUN npm install --only=production
RUN ls
RUN ls public

ENTRYPOINT [ "node", "index" ]
