# 02 Docker image

In this example we are going to create and run Docker images.

We will start from `04-manual-render-deploy`.

# Steps to build it

`npm ci` to install previous sample packages:

```bash
npm ci
```

We can create our custom images. In this case, we will use [the node image](https://hub.docker.com/_/node), the alpine version as base image to create our custom one:

_./Dockerfile_

```Docker
FROM node:22-alpine
```

> You can use [Docker VSCode extension](https://code.visualstudio.com/docs/containers/overview)

Let's create the path where we are going to copy our app:

_./Dockerfile_

```diff
FROM node:22-alpine
+ RUN mkdir -p /usr/app
+ WORKDIR /usr/app

```

> RUN: run commands inside container
>
> WORKDIR: all commands after that will be executed in this path


Let's add the `.dockerignore` to avoid unnecessary files:

_./.dockerignore_

```
.github
node_modules
dist
.editorconfig
.gitignore
.prettierrc
.env.development

```

Copy all files:

_./Dockerfile_

```diff
FROM node:22-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ COPY ./ ./

```

Execute install and build:

_./Dockerfile_

```diff
FROM node:22-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
+ RUN npm ci
+ RUN npm run build

```

How we can run this image? We need to `build` our custom image before run it to be accesible by a docker container.

```bash
docker build -t my-app:1 .
```

> -t: Give a name to image. We can use `-t name:tag`

How to run this image? Right now, we haven't a web server to resolve this static files, so we can use the interactive mode to see inside container:

```bash
docker images

docker run --name my-app-container -it my-app:1 sh

> ls
> ls dist
> exit

docker container rm my-app-container
```

We can create some docker steps to install server and execute it:

_./Dockerfile_

```diff
FROM node:22-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY ./ ./
RUN npm ci
RUN npm run build

+ RUN cp -r ./dist ./server/public
+ RUN cd server && npm ci

+ CMD ["node", "server/index.js"]

```

> RUN vs CMD: I don't want to run `node server` when we build the image, we want to run it when run the container.
>
> [CMD VS ENTRYPOINT](https://codewithyury.com/docker-run-vs-cmd-vs-entrypoint/)

Run the container:

```bash
docker build -t my-app:1 .
docker images

```
> In earlier versions of Docker when you re-use the same tag, it will create a new image with the same tag, but with a different ID. This is called a dangling image and you can remove it with `docker image prune`
>
> But in the latest versions of Docker, it will delete the old image for you.

Run new container:

```bash
docker run --name my-app-container my-app:1

// In another terminal
docker exec -it my-app-container sh

> ls
> ls server
> exit
```

Try to access `http://localhost:8081`


Why can't we access to `http://localhost:8081`? Because this process is executing itself inside container, we need to expose to our machine:

```
docker stop my-app-container
docker rm my-app-container
```

_./Dockerfile_

```diff
...

+ ENV PORT=8083
CMD ["node", "server/index.js"]

```

Run it:

```bash
docker build -t my-app:1 .

docker run --name my-app-container -p 8080:8083 my-app:1
docker run --name my-app-container --rm -p 8080:8083 my-app:1
docker run --name my-app-container --rm -d -p 8080:8083 my-app:1
```

> [Docker run options](https://docs.docker.com/engine/reference/commandline/run/)
>
> -p: Expose a port or a range of ports
>
> --rm: Automatically remove the container when it exits. We still have to use `docker stop`.
>
> `-d`: To start a container in detached mode


Open `http://localhost:8080`

Check `docker images`:

```bash
docker images

```

We can see our image `my-app:1` with the size of `~582MB`, too much size isn't it?. We should use [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) to decrease this size, with only the necessary info:

> Change container project structure:

```
|-- /usr/app
|------ config/
|------ server/
|----------- node_modules/
|----------- public/
|----------- index.js
|----------- package.json
|------ src/


|-- /usr/app
|------ public/
|------ index.js
|------ package.json
```

_./Dockerfile_

```diff
- FROM node:22-alpine
+ FROM node:22-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

+ # Prepare static files
+ FROM base AS build-front
COPY ./ ./
RUN npm ci
RUN npm run build

- RUN cp -r ./dist ./server/public
- RUN cd server && npm ci
+ # Release
+ FROM base AS release
+ COPY --from=build-front /usr/app/dist ./public
+ COPY ./server/package.json ./
+ COPY ./server/package-lock.json ./
+ COPY ./server/index.js ./
+ RUN npm ci --omit=dev

ENV PORT=8083
- CMD ["node", "server/index.js"]
+ CMD ["node", "index.js"]

```

> We can use `npm ci` instead of `npm install` because we have a `package-lock.json` generated.

Run it:

```bash
docker build -t my-app:2 .
docker images

docker stop my-app-container
docker run --name my-app-container --rm -d -p 8080:8083 my-app:2
docker exec -it my-app-container sh
```

We can add more env variables, for example feed the `public` folder.

Update server to consume env variables:

_./server/index.js_

```diff
const express = require('express');
const path = require('path');

const app = express();
- const staticFilesPath = path.resolve(__dirname, './public');
+ const staticFilesPath = path.resolve(__dirname, process.env.STATIC_FILES_PATH);
app.use('/', express.static(staticFilesPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticFilesPath, 'index.html'));
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

```

Update Dockerfile:

_./Dockerfile_

```diff
...
# Release
FROM base AS release
+ ENV STATIC_FILES_PATH=./public
- COPY --from=build-front /usr/app/dist ./public
+ COPY --from=build-front /usr/app/dist $STATIC_FILES_PATH
COPY ./server/package.json ./
...

```

Run again

```bash
docker build -t my-app:2 .
docker images

docker stop my-app-container
docker run --name my-app-container --rm -d -p 8080:8083 my-app:2
docker exec -it my-app-container sh
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
