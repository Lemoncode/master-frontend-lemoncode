# 17 proxy

In this demo we are going to configure Webpack proxy, proxying some URLs can be useful when you have a separate API backend development server and you want to send API requests on the same domain.

We will start from sample _16-bundle-analyzer.

Summary steps:

- Configure _webpack.config_ to send requests from the app's domain to the API.
- Modify webpack.dev.js.
- Modify webpack.prod.js.
- Create script apiTest.tsx.
- Modify index.tsx

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample _16-bundle-analyzer.

## Steps

- `npm install` to install previous sample packages:

```
npm install
```

- Now is the time to modify the performance configuration file.

_./webpack.common.js_

```diff
module.exports = {
    ....
    plugins: [
      new CleanWebpackPlugin(),
      //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: "index.html", //Name of file in ./dist/
        template: "index.html", //Name of template in ./src
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
    ],
+  devServer: {
+    proxy: {
+      "/api": {
+        //The origin of the host header is kept when proxying by default: if true to override this behaviour. 
+        //Use when is name-based hosted sites.
+        "changeOrigin": true,
+        //If you don't want /api to be passed along, we need to rewrite the path:
+        pathRewrite: { "^/api": "" },
+        // If you want filter the request  type 
+        bypass: function(req, res, proxyOptions) {
+          if(req.method != 'GET') return false;
+        }
+      },
+      "/get": {
+        //The origin of the host header is kept when proxying by default: if true to override this behaviour. 
+        //Use when is name-based hosted sites.
+        "changeOrigin": true,
+        //If you don't want /api/get to be passed along, we need to rewrite the path:
+        pathRewrite: { "^/api/get": "" },
+        // If you want filter the request  type 
+        bypass: function(req, res, proxyOptions) {
+          if(req.method != 'GET') return false;
+        }
+      }
+    }
+  }
};
```

- Now modifiy _webpack.dev.js_

```diff
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    stats: "errors-only",
  },
  plugins: [
    new Dotenv({
      path: "./dev.env",
    }),
  ],
+  devServer: {
+   proxy: {
+      "/api": {
+        target: "https://httpbin.org/",
+      },
+      "/get": {
+        target: "https://httpbin.org/",
+      }
+    }
+  },
});
```

- Now modifiy _webpack.dev.js_
```diff
module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    stats: "errors-only",
  },
  plugins: [
    new Dotenv({
      path: "./dev.env",
    }),
  ],
+  devServer: {
+   proxy: {
+      "/api": {
+        target: "https://myApi.com",
+      },
+      "/get": {
+        target: "https://myApi.com",
+      }
+    }
+  },
});
```

- Now create a new file _apiTest.tsx_

```javascript
import React from "react";
const reqGet = (() => {
    let status = "pending";
    let result;
    const resultData = fetch("api/get")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            status = "success";
            console.log(data);
            result = data;
        })
        .catch(error => {
            status = "error";
            result = `${status} ${error}`;
        });

    return {
        Request() {
            if (status === "pending") {
                console.log(status);
                throw resultData;
            } else if (status === "error") {
                console.log(status);
                return result;
            } else if (status === "success") {
                console.log(status);
                return result;
            }
        }
    }
})()

function getListObject(obj) {
    return (
        <ul>
            {Object.keys(obj).map((keyOb) =>
                (<li>
                    {keyOb}:&nbsp;
                    {typeof obj[keyOb] === "object" ?
                        getListObject(obj[keyOb]) :
                        obj[keyOb]}
                </li>))}
        </ul>
    )
}

export const RequestGet = () => {
    let obj = reqGet.Request();
    return (<div>
        <h5>Result API http://localhost:8080/api/get: </h5>
        {typeof obj === "object" ? getListObject(obj) : obj}
    </div>);
}
```

Finally, we need to update _index.tsx_:

```diff
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
++ import { RequestGet } from "./apiTest";
import { AverageComponent } from "./averageComponent";
import { TotalScoreComponent } from './totalScoreComponent';

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
    <TotalScoreComponent />
++    <Suspense fallback={<h1>Loading ...</h1>}>
++      <RequestGet />
++    </Suspense>
  </div>,
  document.getElementById("root")
);
```

- Now we execute the command `npm start`

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
