# 03 Upload docker image

In this example we are going to upload Docker images to Dockerhub.

We will start from `02-docker-image`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- First, we need to login in Docker Hub registry:

```bash
docker login
docker login <registry>
```

> `<registry>`: By default is docker.io.
> We can use `docker info` to see it.

- Then we need tag the image with registry and path information to match with the `DockerHub` repository name that we would like to upload:

```bash
docker tag <app-name>:<tag> <registry>/<path-to-repository>

# Docker Hub case
docker tag my-app:2 <user-name>/<app-name>

```

> `<registry>`: By default is docker.io.
> `<path-to-repository>`: In the DockerHub case is <user-name>/<app-name>
> `<tag>`: is optionally, by default would be latest.

- Check image list now:

```bash
docker images
```

- Now, we can use docker `push` to upload it:

```bash
docker push <user-name>/<app-name>
```

- We can use same image to tag `DockerHub` versions:

```bash
docker tag <app-name>:<tag> <registry>/<path-to-repository>:<tag>

# Docker Hub case
docker tag my-app:2 <user-name>/<app-name>:<tag>

```

```bash
docker tag my-app:2 <user-name>/<app-name>:2
docker images
docker push <user-name>/<app-name>
```

- Let's update the version:

_./Dockerfile_

```diff
...

- ENV PORT=8083
- EXPOSE 8083
+ ENV PORT=8000
+ EXPOSE 8000

ENTRYPOINT [ "node", "index" ]

```

- Built and upload again:

```bash
docker build -t <user-name>/my-app:3 .
docker images
docker push <user-name>/my-app:3
```

- We should update the `latest` version to tag equals `3`:

```bash
docker tag <user-name>/my-app:3 <user-name>/my-app
docker images
docker push <user-name>/my-app
```

- We can run the uploaded image version:

```bash
docker stop my-app
docker run --name my-app --rm -p 8080:8000 -d <user-name>/my-app:3
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
