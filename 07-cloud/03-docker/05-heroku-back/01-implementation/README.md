# 05-heroku-back

In this example we are going to upload Docker image with a backend app to Heroku.

We will start from `04-heroku-front` and `00-backend-start`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- First, we need to create a `.env` file with same data as `.env.example`:

_./.env_

```
NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8080
MONGODB_URI=mongodb://localhost:27017/demo-cloud

```

- This app is using a [mongodb database](https://www.mongodb.com/), instead of [download and install the MongoDB software](https://docs.mongodb.com/manual/administration/install-community/) we can use [docker to run an MongoDB](https://hub.docker.com/_/mongo) instance for local development.

```bash
docker run --name my-mongo-db -p 27017:27017 -d mongo:4.2.10
docker ps
```

> [Default mongodb port](https://docs.mongodb.com/manual/reference/default-mongodb-port/)

- Let's connect to mongodb instance and create some data:

```bash
docker exec -it my-mongo-db sh

# Inside Docker container instance
mongo
show dbs
use my-db
show collections
db.clients.insert({ name: "Client 1" })
show collections
db.clients.find().pretty()
exit
exit

# Remove container
docker container rm my-mongo-db -f
```

- We will use same approach but using [`Docker Compose`](https://docs.docker.com/compose/):

```bash
# In first terminal
npm run start:local-db

# In second terminal
docker ps
docker exec -it mongo-demo-cloud sh
mongo
show dbs

# In third terminal
npm run start:seed-data

# In second terminal
show dbs
use demo-cloud
db.members.find().pretty()
exit
exit
```

- Close second and third terminal and run in the first one:

```bash
npm start
```
> Open browser in http://localhost:8081/members/lemoncode

- We will configure the [Github Actions](https://docs.github.com/en/free-pro-team@latest/actions) as we did in `04-heroku-front` example.

- Create new repository and upload files:

```bash
git init
git remote add origin https://github.com/...
git add .
git commit -m "initial commit"
git push -u origin master
```

- Create new branch `feature/configure-cd`.

- We need an to create a [new heroku app](https://dashboard.heroku.com/) to deploy it.

- This time, we need an [auth token](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-authorizations-create) to heroku login inside Github Action job:

```bash
heroku login
heroku authorizations:create -d <description>
```

> -d: Set a custom authorization description
> -e: Set expiration in seconds (default no expiration)
> `heroku authorizations`: Get auth token list.

- Add `Auth token` to git repository secrets:

![01-github-secret](./readme-resources/01-github-secret.png)

![02-token-as-secret](./readme-resources/02-token-as-secret.png)

> [Heroku API KEY storage](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-authorizations-create)

- We can add `HEROKU_APP_NAME` as secret too:

![03-heroku-app-name](./readme-resources/03-heroku-app-name.png)

- Now, we can defined another file for `Continuos Deployment workflow`:

_./.github/workflows/cd.yml_

```yml
name: Continuos Deployment workflow

on:
  push:
    branches:
      - master

env:
  HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}

jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2
      - name: Install heroku and login
        # Login using HEROKU_API_KEY env variable
        run: |
          curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
          heroku container:login
      - name: Build docker image
        run: docker build -t ${{ secrets.HEROKU_APP_NAME }}:${{ github.run_id }} .
      - name: Deploy docker image
        run: |
          docker tag ${{ secrets.HEROKU_APP_NAME }}:${{ github.run_id }} registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web
          docker push registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web
      - name: Release
        run: heroku container:release web -a ${{ secrets.HEROKU_APP_NAME }}

```

> NOTE: You don't need to run `heroku login` using `HEROKU_API_KEY env variable`.
> References:
> [Heroku install](https://devcenter.heroku.com/articles/heroku-cli#standalone-installation)
> [Heroku Docker Deploy](https://devcenter.heroku.com/articles/container-registry-and-runtime)
> [Github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context)

- Add Dockerfile:

_./Dockerfile_

```Dockerfile
FROM node:12-alpine AS base
RUN mkdir -p /usr/app
WORKDIR /usr/app

# Build backend
FROM base AS build-backend
COPY ./ ./
RUN npm install
RUN npm run build

# Release
FROM base AS release
COPY --from=build-backend /usr/app/dist ./
COPY ./package.json ./
RUN npm install --only=production

ENTRYPOINT [ "node", "index" ]

```

- Create new PR and merge it.

- Check `herokuapp.com/members/facebook`.

```bash
heroku logs -a <name>
```

- We need to upload data to MongoDB production database. Let's pick up the production connection string and update `.env` file:

_./.env_

```diff
- NODE_ENV=development
+ NODE_ENV=production
PORT=8081
CORS_ORIGIN=http://localhost:8080
- MONGODB_URI=mongodb://localhost:27017/demo-cloud
+ MONGODB_URI=...

```

- Run `seed-data`:

```bash
npm run start:seed-data
```

- Let's update `env variables` in heroku portal:

![04-env-variables](./readme-resources/04-env-variables.png)

```
CORS_ORIGIN=...
MONGODB_URI=...

```

- Update `env` again:

_./.env_

```diff
- NODE_ENV=production
+ NODE_ENV=development
PORT=8081
CORS_ORIGIN=http://localhost:8080
- MONGODB_URI=...
+ MONGODB_URI=mongodb://localhost:27017/demo-cloud

```

# Update front project

- Update env variables:

_./dev.env_

```diff
NODE_ENV=development
ORGANIZATION=lemoncode
+ BASE_API_URL=http://localhost:8081

```

_./prod.env_

```diff
NODE_ENV=development
ORGANIZATION=lemoncode
+ BASE_API_URL=...herokuapp.com

```

- Update `api`:

_./src/pods/list/api/list.api.ts_

```diff
import Axios from 'axios';
import { Member } from './list.api-model';

+ const url = `${process.env.BASE_API_URL}/members`;

export const getMemberList = async (
  organization: string
): Promise<Member[]> => {
- const { data } = await Axios.get(
-   `https://api.github.com/orgs/${organization}/members`
- );
+ const { data } = await Axios.get(`${url}/${organization}`, {
+   headers: {
+     'Access-Control-Allow-Origin': '*',
+   },
+ });
  return data;
};

```

- Run backend and frontend.

- Commit push `frontend repository`.

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
