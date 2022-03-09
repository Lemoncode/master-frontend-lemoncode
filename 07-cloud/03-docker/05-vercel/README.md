# 05 Vercel

In this example we are going to upload Docker image with a front app to Vercel.

We will start from `04-heroku-front`.

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

- If we navigate to `https://vercel.com/`, it provides deploy project from `Git repository` or `Clone a template`, but what if we want to use `Github Actions`?

- We can use [Vercel CLI](https://vercel.com/docs/cli):

```bash
npm i -g vercel
```

- Link current code with a new project in vercel:

```bash
vercel link
```
