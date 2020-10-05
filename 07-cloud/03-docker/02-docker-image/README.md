# 02 Use docker image

In this example we are going to create and run Docker images.

We will start from `01-production-bundle`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We can create our custom images. In this case, we will use [the node image](https://hub.docker.com/_/node), the alpine version as base image to create our custom one:

_./Dockerfile_

```Docker
FROM node:12-alpine
```

> You can use [Docker VSCode extension](https://code.visualstudio.com/docs/containers/overview)

- Let's create the path where we are going to copy our app:

_./Dockerfile_

```diff
FROM node:12-alpine
+ RUN mkdir -p /usr/app
+ WORKDIR /usr/app

```

> RUN: run commands inside container
> WORKDIR: all commands after that will be executed in this path


- Let's add the `.dockerignore` to avoid unnecessary files:

_./.dockerignore_

```
node_modules
.vscode
dist
.editorconfig
.env
.env.example
.gitignore
package-lock.json
README.md

```

- Copy all files:

_./Dockerfile_

```diff
FROM node:12-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ COPY ./ ./

```

- Execute install and build:

_./Dockerfile_

```diff
FROM node:12-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
+ RUN npm install
+ RUN npm run build

```

- How we can run this image? We need to `build` our custom image before run it to be accesible by a docker container.

```bash
docker build -t my-app:1 .
```

> -t: Give a name to image. We can use `-t name:tag`

- How to run this image? Right now, we haven't a web server to resolve this static files, so we can use the interactive mode to see inside container:

```bash
docker images
docker run -it my-app:1 sh
```

> Tag is optionally.
> We can see the files after build in `cd ./dist && ls`

- We can create a node.js server this static files. Create `server` folder and:

```bash
cd ./server
npm init -y
```

- Install `express`:

```bash
npm install express --save
```

- Create server:

_./server/index.js_

```javascript
const express = require('express');
const path = require('path');

const app = express();
const staticFilesPath = path.resolve(__dirname, '../dist');
app.use('/', express.static(staticFilesPath));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
```

- Let's check it:

```bash
cd ..
npm run build
node server
```

- We have to do same steps in the docker file:

_./Dockerfile_

```diff
FROM node:12-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
RUN npm install
RUN npm run build

+ RUN cd server
+ RUN npm install

+ ENTRYPOINT [ "node", "server" ]

```

> RUN vs ENTRYPOINT: I don't want to run `node server` when we build the image, we want to run it when run the container.

- Run the container:

```bash
docker build -t my-app:1 .
docker run my-app:1
```

- Why can't we access to `http://localhost:8081`? Because this process is executing itself inside container, we need to expose to our machine:

_./Dockerfile_

```diff
FROM node:12-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
RUN npm install
RUN npm run build

RUN cd server
RUN npm install

+ ENV PORT=8083
+ EXPOSE 8083
ENTRYPOINT [ "node", "server" ]

```

- Run it:

```bash
docker ps
docker stop <CONTAINER ID>
docker build -t my-app:1 .
docker run --rm -p 8080:8083 my-app:1
```

> [Docker run options](https://docs.docker.com/engine/reference/commandline/run/)
> -p: Expose a port or a range of ports
> --rm: Automatically remove the container when it exits. We still have to use `docker stop`.

- If we check `docker images` we can see dangling images, due to use same tags for each build.

```bash
docker image prune
```

- On the other hand, we have an image with `361MB`, too much size isn't it?. We should use [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) to decrease this size, with only the necessary info:

_./Dockerfile_

```diff
- FROM node:12-alpine
+ FROM node:12-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ # Prepare static files
+ FROM base AS build-front
COPY ./ ./
RUN npm install
RUN npm run build

- RUN cd server
- RUN npm install
+ # Release
+ FROM base AS release
+ COPY --from=build-front /usr/app/dist ./public
+ COPY ./server/package.json ./
+ COPY ./server/index.js ./
+ RUN npm install --only=production

ENV PORT=8083
+ ENV STATIC_FILES_PATH=./public

EXPOSE 8083
- ENTRYPOINT [ "node", "server" ]
+ ENTRYPOINT [ "node", "index" ]

```

- Update server to consume env variable:

_./server/index.js_

```diff
const express = require('express');
const path = require('path');

const app = express();
- const staticFilesPath = path.resolve(__dirname, '../dist');
+ const staticFilesPath = path.resolve(__dirname, process.env.STATIC_FILES_PATH);
app.use('/', express.static(staticFilesPath));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

```

- Run it:

```bash
docker build -t my-app:2 .
docker run --rm -p 8080:8083 my-app:2
```

- Check now the images:

```bash
docker images
```

- We can run it, in background:

```bash
docker stop <Container ID>
docker run -d --rm -p 8080:8083 my-app:2

```

> `-d`: To start a container in detached mode

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
