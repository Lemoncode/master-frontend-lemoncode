# 12 CSS Modules

In this demo we are going to isolate different scss files using same css class names.
We will learn how to configure it and how to deal with external css class provided by third libraries like Bootstrap.

We will start from sample _11-react_.

Summary steps:

- Update `webpack.config.js` with CSS Modules config.
- Add scss file with averageComponent styles.
- Create other component and scss file with same class name.
- Create selector using custom class and Bootstrap class.

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample _11 react_.

## steps

- `npm install` to install previous sample packages:

```
npm install
```

- We can start creating `AverageComponent` styles file (SASS file):

_./src/averageComponentStyles.scss_

```css
$background: teal;

.result-background {
  background-color: $background;
}
```

- Let's go and use this style in `AverageComponent`:

_./src/averageComponent.tsx_

```diff
import React from 'react';
import { getAvg } from './averageService';

export const AverageComponent: React.FunctionComponent = () => {
  const [average, setAverage] = React.useState<number>(0);

  React.useEffect(() => {
    const scores: number[] = [90, 75, 60, 99, 94, 30];
    setAverage(getAvg(scores));
  }, []);

  return (
    <div>
-     <span>Students average: {average}</span>
+     <span className="result-background">Students average: {average}</span>
    </div>
  );
};

```

- Finally we need to update `webpack.config` to load `.scss` file, as we usually load it in other samples:

_./webpack.config.js_

```diff
...
  entry: {
    app: ['regenerator-runtime/runtime', './students.tsx'],
-   appStyles: ['./mystyles.scss'],
+   appStyles: ['./mystyles.scss', './averageComponentStyles.scss'],
    ...
  },
  ...
};

```

- Run example:

```bash
npm start
```

- If we run the the sample we can check that the style is being applied to the component (background color), but we are using global css names.

- Now we are going to create `totalScoreComponent` creating the component [./src/totalScoreComponent.tsx](./src/totalScoreComponent.tsx) and its style [/src/totalScoreComponentStyles.scss](/src/totalScoreComponentStyles.scss) :

_./src/averageService.ts_

```diff
- function getTotalScore(scores) {
+ export function getTotalScore(scores) {
  return scores.reduce((score, count) => score + count);
}

export function getAvg(scores) {
  return getTotalScore(scores) / scores.length;
}

```

_./src/totalScoreComponent.jsx_

```javascript
import React from "react";
import { getTotalScore } from "./averageService";

export const TotalScoreComponent = () => {
  const [totalScore, setTotalScore] = React.useState(0);

  React.useEffect(() => {
    const scores = [10, 20, 30, 40, 50];
    setTotalScore(getTotalScore(scores));
  }, []);

  return (
    <div>
      <span className="result-background">
        Students total score: {totalScore}
      </span>
    </div>
  );
};
```

_./src/totalScoreComponentStyles.scss_

```css
$background: indianred;

.result-background {
  background-color: $background;
}
```

> NOTE: we are declaring same class name for TotalScoreComponent on purpose

- Using `TotalScoreComponent`:

_./src/index.jsx_

```diff
import React from 'react';
import ReactDOM from 'react-dom';
import { AverageComponent } from './averageComponent';
+ import { TotalScoreComponent } from './totalScoreComponent';
const logoImg = require('./content/logo_1.png');

$('body').css('background-color', 'lightSkyBlue');

const img = document.createElement('img');
img.src = logoImg;

document.getElementById('imgContainer').appendChild(img);

ReactDOM.render(
  <div>
    <h1>Hello from React DOM</h1>
    <AverageComponent />
+   <TotalScoreComponent />
  </div>,
  document.getElementById('root')
);

```

- And update `webpack.config`:

_./webpack.config.js_

```diff
...
  entry: {
    ...
    appStyles: [
      './mystyles.scss',
      './averageComponentStyles.scss',
+     './totalScoreComponentStyles.scss',
    ],
    ...
  },
  ...
};

```

- Now if we run the project, we will find that both css names overlaps.

```
npm start
```

- As result, averageComponentStyles are overridden by totalScoreComponentStyles. How to solve this? _CSS Modules to the rescue!_

- CSS Modules scope is to isolate different scss files using same css class names. We are going to replace `adding styles via webpack entry point` by `import styles where we need it`. Let's configure it:

_./webpack.config.js_

```diff
...
  entry: {
    ...
    appStyles: [
      './mystyles.scss',
-     './averageComponentStyles.scss',
-     './totalScoreComponentStyles.scss',
    ],
    ...
  },
  module: {
    rules: [
      ...
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
-         'css-loader',
+         {
+            loader: "css-loader",
+            options: {
+              import: false,
+              modules: true,
+            },
+          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            },
          },
        ],
      },
      ...
    ],
  },
  ...
};
```

> **IMPORTANT** Remember to stop and start your wepback dev server in order to get the udpates introduced in the _webpack.config.js_ file.

- Updating `AverageComponent`:

_./src/averageComponent.jsx_

```diff
import React from 'react';
import { getAvg } from './averageService';
+ const classes = require('./averageComponentStyles.scss').default;

export const AverageComponent: React.FunctionComponent = () => {
  ...

  return (
    <div>
-     <span className="result-background">
+     <span className={classes['result-background']}>
        Students average: {average}
      </span>
    </div>
  );
};

```

- Updating `TotalScoreComponent`:

_./src/totalScoreComponent.jsx_

```diff
import React from 'react';
import { getTotalScore } from './averageService';
+ const classes = require('./totalScoreComponentStyles.scss').default;

export const TotalScoreComponent: React.FunctionComponent = () => {
  ...

  return (
    <div>
-     <span className="result-background">
+     <span className={classes['result-background']}>
        Students total score: {totalScore}
      </span>
    </div>
  );
};

```

- Now we get the right isolation.

```bash
npm start
```

- To avoid reference classNames like `classNames['result-background']`, webpack provides us to transform `kebab case` to `camelCase`:

_./webpack.config.js_

```diff
...
  module: {
    rules: [
      ...
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              import: false,
-                            modules: true,
+              modules: {
+                exportLocalsConvention: "camelCase",
+              },
            },
          },
          ...
        ],
      },
      ...
    ],
  },
  ...
};
```

> **IMPORTANT** Remember to stop and start your webpack server in order to get the udpates introduced in the _webpack.config.js_ file.

- Updating components:

_./src/averageComponent.tsx_

```diff
- const classes = require("./averageComponentStyles.scss").default;
+ import classes from "./averageComponentStyles.scss";

...
  return (
    <div>
-     <span className={classes['result-background']}>
+     <span className={classes.resultBackground}>
        Students average: {average}
      </span>
    </div>
  );
};

```

_./src/totalScoreComponent.tsx_

```diff
-const classes = require("./totalScoreComponentStyles.scss").default;
+ import classes from "./totalScoreComponentStyles.scss";

...

  return (
    <div>
-     <span className={classes['result-background']}>
+     <span className={classes.resultBackground}>
        Students total score: {totalScore}
      </span>
    </div>
  );
};
```

- Running `npm start` again:

```bash
npm start
```

- That was look but we are getting weird class names, how can we indentify that in a more friendly way?

```diff
  {
    loader: "css-loader",
    options: {
      import: false,
      modules: {
        exportLocalsConvention: "camelCase",
+        localIdentName: '[path][name]__[local]--[hash:base64:5]',
+        localIdentContext: path.resolve(__dirname, 'src'),
+        localIdentHashPrefix: 'my-custom-hash',
      },
    },
  },
```

- If we take a look to the browser console, we can see how webpack transform css class names, adding prefixes (inspect element).

- Finally, let's do an example where we need to add styles to element that has a Bootstrap class:

_./src/averageComponent.jsx_

```diff
...

  return (
    <div>
      <span className={classes.resultBackground}>
        Students average: {average}
      </span>
+     <div className={`jumbotron ${classes.resultBackground}`}>
+       <h1>Jumbotron students average: {average}</h1>
+     </div>
    </div>
  );
};

```

- Running `npm start`, it looks a bit weird:

- Let's go to add own styles:

_./src/averageComponentStyles.scss_

```diff
$background: teal;
+ $jumbotronBackground: darkseagreen;

.result-background {
  background-color: $background;
}

+ .jumbotron.result-background {
+   background-color: $jumbotronBackground;
+   display: block;
+ }

```

- Running `npm start` nothing changes, why? Due to webpack is transform `local` class names to `'[name]__[local]___[hash:base64:5]'` we need to tell him that jumbotron is a `global` style ([more info](https://webpack.js.org/loaders/css-loader/#-css-modules-https-github-com-css-modules-css-modules-)):

_./src/averageComponentStyles.scss_

```diff
$background: teal;
$jumbotronBackground: darkseagreen;

.result-background {
  background-color: $background;
}

- .jumbotron.result-background {
+ :global(.jumbotron).result-background {
  background-color: $jumbotronBackground;
  display: block;
}

```

- If we run the project now we can see that the change has been applied globally.

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
