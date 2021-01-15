# Initial boiler plate

This is just a simple boiler plate that will let us having a playground for our examples.

Project setup:

- Bundling: **Parcel**.
- Language: **Typescript**.
- Libraries imported: d3js (whole library, not using selective imports approach).

codesandbox: https://codesandbox.io/s/lucid-noether-6hbpr

This examples would work using any other bundler, e.g. **Webpack**, just chosen **Parcel** for the
sake of simplicity.

You will need to have installed an uptodate version of **nodejs** to run this example.

# Steps

Steps to recreate this example from scratch:

- Initialize the project

```bash
npm init -y
```

- Install **Parcel**:

```bash
npm install parcel --save-dev
```

- Install **rimraf** (to cleanup dist folder), and **npm-run-all** (to launch tasks in parallel).

```bash
npm install rimraf npm-run-all --save-dev
```

- Install **Typescript**:

```bash
npm install typescript --save-dev
```

- Let's add a _tsconfig_ file.

_./tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "es6",
    "moduleResolution": "node",
    "declaration": false,
    "noImplicitAny": false,
    "sourceMap": true,
    "jsx": "react",
    "noLib": false,
    "allowJs": true,
    "suppressImplicitAnyIndexErrors": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "baseUrl": "./src/"
  },
  "include": ["./src/**/*"]
}
```

- Let's add a command in package.json to launch the application:

_./package.json_

```diff
  "scripts": {
+    "start": "run-p -l type-check:watch start:dev",
+    "type-check": "tsc --noEmit",
+    "type-check:watch": "npm run type-check -- --watch",
+    "start:dev": "parcel ./src/index.html",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- Install d3js:

```bash
npm install d3 --save
```

- Install d3js typings:

```bash
npm install @types/d3 --save
```

- Create a _./src_ folder
- Create a new file _./src/base.css_
- Let's add some CSS

```css
/*
	Theme Name: ReClean
	Theme URI: http://www.codenx.com/
	Theme Version: 1.0
	Theme Date: 2013-03-12
	Theme Author: CodeNx
	Theme Author URI: http://www.codenx.com/
	Theme License: GPLv2
*/

/*---[ Start: global css ]---*/

/* Import Google Web Fonts
@import url(http://fonts.googleapis.com/css?family=Maven+Pro:400);
-------------------------------------------------- @import url(http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800);
*/
/**
    * Eric Meyer's Reset CSS v2.0 (http://meyerweb.com/eric/tools/css/reset/)
    * http://cssreset.com
    */
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.clearfix {
  display: inline-table;
}
/* Hides from IE-mac \*/
* html .clearfix {
  height: 1%;
}
.clearfix {
  display: block;
}
/* End hide from IE-mac */

:-moz-placeholder {
  color: #aaa !important;
  font-style: italic;
  line-height: 20px;
}
::-webkit-input-placeholder {
  color: #aaa !important;
  font-style: italic;
  line-height: 20px;
}
body {
  background: none repeat scroll 0% 0% rgb(255, 255, 255);
  font: 400 100%/1.625 "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #3b3b3b;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
h1 {
  font-weight: 400;
  line-height: 1.1em;
  border-bottom: 1px dashed #0077bb;
  position: relative;
  padding: 14px 25px 5px 0;
  font-size: 2.5em;
  text-transform: uppercase;
  line-height: 1.2em;
  margin: 0.2em 0px 20px -2px;
  color: rgb(0, 170, 238);
  text-decoration: none;
}
h2 {
  font-size: 16px;
  color: #111;
  padding: 5px 20px !important;
  clear: both;
  background: #eee;
  font-weight: 700;
}
h3 {
  margin: 0 0 10px 0;
  color: #111;
}
blockquote {
  background: #eee;
  padding: 15px;
  margin: 30px auto;
  border: 1px solid #aaa;
  font-size: 16px;
  font-style: italic;
  color: #000;
  position: relative;
}
blockquote p {
  margin: 0;
  padding: 0;
}
img {
  border: none;
}
ul.left {
}

ul.right {
  text-align: right;
}
a:link,
a:visited {
  text-decoration: none;
  color: #0077bb;
}
a:hover,
a:active {
  color: #0099cc;
  text-decoration: underline;
}
button::-moz-focus-inner {
  border: 0;
  padding: 0;
}
form,
fieldset {
  padding: 0;
  margin: 0;
  border: none;
}
.header {
  background-color: #fff;
  height: 10%;
}
.header-wrapper {
  width: 998px;
  margin: 0 auto;
  background-color: #fff;
}
.logo {
  width: 200px;
  margin-top: 10px;
}
.search {
  margin-top: 10px;
}
.nav {
  height: 10%;
  background-color: #00aeec;
}
.nav-wrapper {
  margin: 0 auto;
  width: 998px;
}
.nav ul,
.header ul,
.sidebar ul {
  list-style: none;
  list-style-type: none;
}
.nav ul li,
.header ul li {
  display: inline;
  padding: 0px 10px 0px 10px;
}
.nav ul li {
  padding: 0 20px;
}
```

- Let's also create a main _index.html_ under _./src_ folder

_./src/index.html_

```html
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="./base.css" />
  </head>
  <body>
    <script src="./index.ts"></script>
  </body>
</html>
```

- Let's create a _index.ts_ file under _./src_ folder and add some basic d3js content to check that everything is working fine

_./src/index.ts_

```typescript
import * as d3 from "d3";

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500);

svg
  .append("text")
  .attr("x", 100)
  .attr("y", 100)
  .text("Hello d3js");

svg
  .append("circle")
  .attr("r", 20)
  .attr("cx", 20)
  .attr("cy", 20);
```

- Let's add a data file:

_./src/data.ts_

```typescript
export interface ResultEntry {
  party: string;
  seats: number;
}

// Approx numbers
// https://www.lavanguardia.com/elecciones/elecciones-generales-noviembre-2019

export const resultCollectionSpainNov19: ResultEntry[] = [
  {
    party: "PSOE",
    seats: 120
  },
  {
    party: "PP",
    seats: 88
  },
  {
    party: "VOX",
    seats: 52
  },
  {
    party: "UP",
    seats: 35
  },
  {
    party: "ERC",
    seats: 13
  },
  {
    party: "Cs",
    seats: 10
  },
  {
    party: "JxCat",
    seats: 8
  },
  {
    party: "PNV",
    seats: 7
  },
  {
    party: "Bildu",
    seats: 5
  },
  {
    party: "Más pais",
    seats: 4
  },
  {
    party: "CUP",
    seats: 2
  },
  {
    party: "CC",
    seats: 2
  },
  {
    party: "BNG",
    seats: 1
  },
  {
    party: "Teruel Existe",
    seats: 1
  }
];

export const resultCollectionSpainApr19: ResultEntry[] = [
  {
    party: "PSOE",
    seats: 123
  },
  {
    party: "PP",
    seats: 66
  },
  {
    party: "VOX",
    seats: 24
  },
  {
    party: "UP",
    seats: 42
  },
  {
    party: "ERC",
    seats: 15
  },
  {
    party: "Cs",
    seats: 57
  },
  {
    party: "JxCat",
    seats: 7
  },
  {
    party: "PNV",
    seats: 6
  },
  {
    party: "Bildu",
    seats: 4
  },
  {
    party: "Más pais",
    seats: 4
  },
  {
    party: "CUP",
    seats: 2
  },
  {
    party: "CC",
    seats: 2
  },
  {
    party: "BNG",
    seats: 1
  },
  {
    party: "Compromis",
    seats: 1
  }
];
```

- Let's run the example

```bash
npm start
```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
