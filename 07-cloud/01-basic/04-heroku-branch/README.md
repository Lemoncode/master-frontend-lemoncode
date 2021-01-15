# 04 Heroku branch

In this example we are going to create a production server using Heroku.

We will start from `03-github-branch`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- Create `heroku app`:

![01-create-heroku-app](./readme-resources/01-create-heroku-app.png)

![02-create-heroku-app](./readme-resources/02-create-heroku-app.png)

- We need to use an [Heroku buildpack](https://elements.heroku.com/buildpacks). It's a tool to build processes for your preferred language or framework. Right now, we can use [heroku-buildpack-static](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-static):

![03-static-files-buildpack](./readme-resources/03-static-files-buildpack.png)

> Buildpack url https://github.com/heroku/heroku-buildpack-static.git

- We need `git` to clone the Heroku app repository and works on it. Check `Delpoy` tab too:

```bash
npx heroku login
git clone https://git.heroku.com/<heroku-app-name>.git
```
> NOTE: [Download heroku cli](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
> Use `npm install -g heroku`
> Or using [npx](https://github.com/npm/npx)

- Copy `./dist` files to new repository.

- Add `static.json` file for deploy config:

_./static.json_

```bash
{
  "root": "./"
}

```

- Commit and push:

```bash
git add .
git commit -m "add static files"
git push
```

- Sometimes, we need create our custom web server to deploy `static files` and use same server to expose REST API / GraphQL endpoints. We can use [nodejs buildpack](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs):

![04-nodejs-buildpack](./readme-resources/04-nodejs-buildpack.png).

- Add a simple web server using `nodejs` and express:

```bash
npm init -y
npm install express --save
```

- Remove `static.json` file and move `static files` to public folder.

- Add `.gitignore` file:

_.gitignore_

```
node_modules

```

- Create a simple server using [express](https://github.com/expressjs/express):

_index.js_

```javascript
const express = require('express');
const path = require('path');

const app = express();
const staticFilesPath = path.resolve(__dirname, './public');
app.use('/', express.static(staticFilesPath));

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

```

- We can run it on local:

_./package.json_

```diff
...
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
+   "start": "node index.js"
  },
```

- Run it:

```bash
npm start
```

- Add a custom REST API endpoint:

_./index.js_

```diff
const express = require('express');
const path = require('path');

const app = express();
const staticFilesPath = path.resolve(__dirname, './public');
app.use('/', express.static(staticFilesPath));

+ app.use("/api/hello", async (req, res) => {
+   res.send("Custom API endpoint");
+ });

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});

```

- Check it:

```bash
npm start
```

- Deploy it:

```bash
git add .
git commit -m "add nodejs + express server"
git push
```

- If you want to see logs:

```bash
npx heroku login
npx heroku logs -a <heroku-app-name>
```

> NOTE: [Download heroku cli](https://devcenter.heroku.com/articles/heroku-cli#download-and-install)
> Use `npm install -g heroku`
> Or using [npx](https://github.com/npm/npx)

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
