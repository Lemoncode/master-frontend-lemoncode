# 01 Docker commands

In this example we are going to learn and run Docker commands.

- First, we will check availables `built images` on local:

```bash
docker images
```

- How to download a new one? We can use `docker pull` to download an external pre-built images. If we don't use any tag, it will download the `latest` tag:

```bash
docker pull hello-world
```

> `hello-world` is an existing image.
> By default it downloads all images from [Docker hub](https://hub.docker.com/) registry.
> [Pull from different registry](https://docs.docker.com/engine/reference/commandline/pull/#pull-from-a-different-registry): docker pull myregistry.local:5000/testing/test-image

- Check now the availables images:

```bash
docker images
```

- To run an image we need a Docker `container`, to create a new container based on an image, we need to use the `docker run` command. Before that, we can list how many containers we have:

```bash
docker ps
docker ps --all
docker ps -a
```

> ps: Process Status
> `docker ps`: List current active containers
> `docker ps -a / --all`: List all containers (active and deactive)

- Let's run the image:

```bash
docker run hello-world
```

- This `image` was executed in a `container` and it stops the container. We can check it on:

```bash
docker ps -a
```

- To run an stopped container we have to use `docker start` not `run` because `docker run` will create a new container from image:

```bash
docker start <Container ID> -i
```

> -i / --interactive: Attach container’s STDIN
> We can use the 4 first digits of the Container ID.

- Creating new container with same image:

```bash
docker run hello-world
```

> NOTE: We can name a container like: `docker run --name my-container hello-world`

- Let's remove all stopped containers:

```bash
docker ps -a
docker container rm <CONTAINER ID>
docker container prune
```

> `prune`: Remove all stopped containers

- Docker run `pull`s images automatically if it hasn't them. Let's remove an existing image:

```bash
docker image rm <IMAGE ID>
docker rmi <IMAGE ID>
docker image prune
```
> `prune`: Remove all dangling images, that is, all images with name equals <none>. Dangling images are not referenced by other images and are safe to delete




# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
