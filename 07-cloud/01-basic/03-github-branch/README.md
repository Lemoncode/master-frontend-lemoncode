# 03 Github branch

In this example we are going to create a production server using Github pages.

We will start from `02-azure-ftp`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Using previous application, we upload it using [Github Pages](https://pages.github.com/). We only need to create a new repository.

> NOTE: In this case we won't use `express server` to serve front app, because Github Pages has its own server.

- Upload files:

```bash
git init
git remote add origin git@github.com...
git add .
git commit -m "initial commit"
git push -u origin master
```

- Run build command:

```bash
npm run build
```

- Create a new branch called `gh-pages`.

- Remove all files except `dist` folder. And move `dist` folder's files to root path. We should have on root path:

```
|- images
|- js
|- index.html

```

- Upload files:

```bash
git add .
git commit -m "upload files"
git push -u origin gh-pages
```

- Now, we have deployed our website in: `https://<user-name>.github.io/<repository-name>`:

![01-open-gh-pages-url](./readme-resources/01-open-gh-pages-url.png)

> NOTE: We can change branch name on Settings tab > GitHub Pages section

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
