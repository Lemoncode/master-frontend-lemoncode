# 02 Azure FTP

In this example we are going to create a production server and upload it to Azure.

We will start from `01-production-bundle`.

# Steps to build it

- `npm install` to install previous sample packages:

```bash
npm install
```

- We are always using the `webpack-dev-server` as the website frontend server for development. But, we need a real website server for production environment, for example in nodejs. Let's implement it.

- Let's install [express](https://github.com/expressjs/express) as simple nodejs server:

```bash
npm install express --save
```

- We will configure in `server` folder:

_./server/index.js_

```javascript
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
