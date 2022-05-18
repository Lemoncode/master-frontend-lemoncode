# 04 Heroku front

In this example we are going to upload Docker image with a front app to Heroku.

We will start from `03-upload-docker-image`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We will configure the [Github Actions](https://docs.github.com/en/free-pro-team@latest/actions) as we did in `02-github-actions` example.

- Create new repository and upload files:

```bash
git init
git remote add origin git@github.com...
git add .
git commit -m "initial commit"
git push -u origin master
```

- We need to create a [new heroku app](https://dashboard.heroku.com/) to deploy it.

![01-create-heroku-app](./readme-resources/01-create-heroku-app.png)

![02-create-heroku-app](./readme-resources/02-create-heroku-app.png)

- Now, we can update the `Continuos Deployment workflow`:

_./.github/workflows/cd.yml_

```diff
...
jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
-     - name: Use SSH key
-       run: |
-         mkdir -p ~/.ssh/
-         echo "${{secrets.SSH_PRIVATE_KEY}}" > ~/.ssh/id_rsa
-         sudo chmod 600 ~/.ssh/id_rsa
-     - name: Git config
-       run: |
-         git config --global user.email "cd-user@my-app.com"
-         git config --global user.name "cd-user"
-     - name: Install
-       run: npm ci
-     - name: Build
-       run: npm run build
-     - name: Deploy
-       run: npm run deploy -- -r git@github.com:<owner>/<repository-name>.git

```

_./.github/workflows/cd.yml_

```diff
name: Continuos Deployment workflow

on:
  push:
    branches:
      - master
+ env:
+   HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
+   IMAGE_NAME: registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web

jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

```
> NOTE: You don't need to run `heroku login` using `HEROKU_API_KEY env variable`.
>
> References:
>
> In this case, we don't install heroku cli due to [Github Actions Virtual Machine](https://github.com/actions/virtual-environments/blob/ubuntu20/20210216.1/images/linux/Ubuntu2004-README.md) has it.
>
> If not:

```yml

      - name: Login heroku app Docker registry
        run: |
          curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
          heroku container:login
```
>
> [Heroku Docker Deploy](https://devcenter.heroku.com/articles/container-registry-and-runtime)
>
> [Github context](https://docs.github.com/en/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions#github-context)

- This time, we need an [auth token](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-authorizations-create) to heroku login inside Github Action job:

```bash
heroku login
heroku authorizations:create -d <description>
```

> -d: Set a custom authorization description
> -e: Set expiration in seconds (default no expiration)
> `heroku authorizations`: Get auth token list.

![03-generate-token](./readme-resources/03-generate-token.png)

- Add `Auth token` to git repository secrets:

![04-github-secret](./readme-resources/04-github-secret.png)

![05-token-as-secret](./readme-resources/05-token-as-secret.png)

> [Heroku API KEY storage](https://devcenter.heroku.com/articles/heroku-cli-commands#heroku-authorizations-create)

- We can add `HEROKU_APP_NAME` as secret too:

![06-heroku-app-name](./readme-resources/06-heroku-app-name.png)


_./.github/workflows/cd.yml_

```diff
name: Continuos Deployment workflow

on:
  push:
    branches:
      - master
  env:
    HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
    IMAGE_NAME: registry.heroku.com/${{ secrets.HEROKU_APP_NAME }}/web

jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
+     - name: Heroku login
+       run: heroku container:login
+     - name: Build docker image
+       run: docker build -t ${{ env.IMAGE_NAME }} .
+     - name: Deploy docker image
+       run: docker push ${{ env.IMAGE_NAME }}
+     - name: Release
+       run: heroku container:release web -a ${{ secrets.HEROKU_APP_NAME }}

```

- Git commit and push:

```bash
git add .
git commit -m "update cd file"
git push
```

Open Heroku server: `https://<heroku-app-name>.herokuapp.com/`

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
