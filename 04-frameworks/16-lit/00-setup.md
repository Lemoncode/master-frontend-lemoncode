```bash
mkdir start-solution
```

```bash
cd start-solution
```

```bash
nvm use 22
```

```bash
npm init -y
```

Update `package.json`

```diff
{
  "name": "start-solution",
  "version": "1.0.0",
  "main": "index.js",
+ "type": "module",
  "scripts": {
...
```

```bash
npm i lit
```

```bash
npm i typescript rimraf @web/dev-server -D
```

Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2021",
    "module": "es2020",
    "lib": ["es2021", "DOM", "DOM.Iterable"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "inlineSources": true,
    "outDir": "./",
    "rootDir": "./src",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitOverride": true,
    "plugins": [
      {
        "name": "ts-lit-plugin",
        "strict": true
      }
    ],
    "types": ["mocha"]
  },
  "include": ["src/**/*.ts"],
  "exclude": []
}
```

Create `src/my-element.ts`

```ts
import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("my-element")
export class MyElement extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;

  @property()
  name = "World";

  @property({ type: Number })
  count = 0;

  override render() {
    return html`
      <h1>${this.sayHello(this.name)}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent("count-changed"));
  }

  sayHello(name: string): string {
    return `Hello, ${name}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-element": MyElement;
  }
}
```

Update `package.json`

```diff
....
  "scripts": {
+   "build": "tsc",
+   "clean": "rimraf my-element.{d.ts,d.ts.map,js,js.map}",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
....
```

```bash
npm run build
```

```bash
npm run clean
```

Create `web-dev-server.config.js`

```js
const mode = process.env.MODE || "dev";

if (!["dev", "prod"].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod" was "${mode}"`);
}

export default {
  nodeResolve: { exportConditions: mode === "dev" ? ["development"] : [] },
  preserveSymlinks: true,
};
```

Create `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Lit Starter Kit</title>
  </head>
  <body>
    <a href="/dev/index.html">Component Demo</a>
  </body>
</html>
```

Create `/dev/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>&lt;my-element> Demo</title>
    <script type="module" src="../my-element.js"></script>
    <style>
      p {
        border: solid 1px solid;
        padding: 8px;
      }
    </style>
  </head>
  <body>
    <my-element>
      <p>This is a child content</p>
    </my-element>
  </body>
</html>
```

Update `package.json`

```diff
....
  "scripts": {
    "build": "tsc",
+   "build:watch": "tsc --watch",
    "clean": "rimraf my-element.{d.ts,d.ts.map,js,js.map}",
+   "serve": "wds --watch",
+   "serve:prod": "MODE=prod npm run serve",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
....
```

```bash
npm run build
```

```bash
npm run serve
```

## Updating build assets

Ok, to make our lives a little bit easier, lets change the ouput directory and use the reference on the index.html that we are serving:

Update `tsconfig.json`

```diff
-"outDir": "./",
+"outDir": "./dist",
```

Update `/dev/index.html`

```diff
-<script type="module" src="../my-element.js"></script>
+<script type="module" src="../dist/my-element.js"></script>
```

Update `package.json`

```diff
....
  "scripts": {
+   "prebuild": "npm run clean:dist",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "clean": "rimraf my-element.{d.ts,d.ts.map,js,js.map}",
+   "clean:dist": "rimraf dist",
    "serve": "wds --watch",
    "serve:prod": "MODE=prod npm run serve",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
....
```

```bash
npm run build
```

```bash
npm run serve
```
