# 04 Different frameworks

In this example we are going to create a microfrontend using `Vue` to be consumed in our `React` host application.

We will start from `01-simple-mfe`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Refactor the `mfe1` app to use Vue instead of React:

_./mfe2_

```bash
npm uninstall react react-dom @rsbuild/plugin-react @types/react @types/react-dom
npm install vue --save
npm install @rsbuild/plugin-vue --save-dev
```

Remove the `mfe2/src/helpers.ts` and `mfe2/src/app.expose.ts` files.

Rename the `bootstrap.tsx` to `bootstrap.ts` and update its content:

_./mfe2/src/bootstrap.ts_

```ts
import { createApp } from "vue";
import App from "./app.vue";

createApp(App).mount("#root");
```

Rename the `app.tsx` to `app.vue` and update its content:

_./mfe2/src/app.vue_

```vue
<script setup lang="ts">
import { ref, version } from "vue";
const count = ref(0);
</script>

<template>
  <div>
    <h2>Microfrontend 1</h2>
    <p>This mfe is using Rsbuild and Vue {{ version }}</p>
    <button @click="count++">Count is {{ count }}</button>
  </div>
</template>
```

Update the `rsbuild.config.ts` to use the Vue plugin:

_./mfe2/rsbuild.config.ts_

```diff
import { pluginModuleFederation } from "@module-federation/rsbuild-plugin";
import { defineConfig } from "@rsbuild/core";
- import { pluginReact } from "@rsbuild/plugin-react";
+ import { pluginVue } from "@rsbuild/plugin-vue";

export default defineConfig({
  plugins: [
-   pluginReact(),
+   pluginVue(),
    pluginModuleFederation({
      name: "mfe1",
      exposes: {
-       "./app": "./src/app.expose.ts",
+       "./app": "./src/app.vue",
-       "./helpers": "./src/helpers.ts",
      },
      shared: {
-       react: {
-         version: "19.2.3",
-         singleton: true,
-         requiredVersion: "^19.2.3",
-       },
+       vue: {
+         version: "3.5.26",
+         singleton: true,
+         requiredVersion: "^3.5.26",
+       },
      },
    }),
  ],
  server: {
    port: 8081,
  },
});

```

Run the `mfe1` application to verify that everything is working:

```bash
npm start
```

Update the `host` application to remove the `mfe1/helpers`:

_./host/src/app.tsx_

```diff
import MFE1 from "mfe1/app";
- import helpers from "mfe1/helpers";
import React from "react";

export const App: React.FC = () => {
- const result = helpers.sum(2, 3);
  return (
    <main>
      <h1>Host App</h1>
      <MFE1 />
-     <p>
-       Sum result mfe1/helpers: <b>{result}</b>
-     </p>
    </main>
  );
};

```

If we try to run the `host`application now:

_./host_

```bash
npm start
```

> We cannot consume the Vue component directly in our React application. We need `some bridge` to make it works.

How can we consume this Vue microfrontend in our React host application? One option is avoiding module federation and use an `iframe`, but if we want to continue using module federation we need a wrapper around the Vue component to make it compatible with React, for example using `custom elements` (web components):

_./host_

```bash
npm install vue --save
```

_./host/src/vue-wrapper.ts_

```ts
import { type App, createApp, type VueElement } from "vue";

export const createCustomElement = (
  tagName: string,
  vueElement: VueElement
) => {
  class VueCustomElement extends HTMLElement {
    private app: App<Element> | null = null;

    connectedCallback() {
      if (!this.app) {
        this.app = createApp(vueElement);
        this.app.mount(this);
      }
    }

    disconnectedCallback() {
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, VueCustomElement);
  }
};
```

Use the wrapper to create a custom element from the Vue microfrontend:

_./host/src/app.tsx_

```diff
import MFE1 from "mfe1/app";
import React from "react";

+ createCustomElement("mfe1-app", MFE1);

export const App: React.FC = () => {
  return (
    <main>
      <h1>Host App</h1>
-     <MFE1 />
+     <mfe1-app />
    </main>
  );
};

```

Run the `host` application again:

```bash
npm start
```

It looks like everything is working fine now! But the `button counter` insn't working. The reason is that the Vue instance of the host application is different than the Vue instance of the microfrontend, so the reactivity system is not working as expected. We need to share the Vue instance between the host and the microfrontend.

_/host/rsbuild.config.ts_

```diff
...
      shared: {
        react: {
          version: "19.2.3",
          singleton: true,
          requiredVersion: "^19.2.3",
        },
+       vue: {
+         version: "3.5.26",
+         singleton: true,
+         requiredVersion: "^3.5.26",
+       },
      },
    }),
  ],
...
```

You can use this approach to mix different frameworks in your microfrontends, but some considerations must be taken into account:

- Custom elements does not support server-side rendering.
- We need an advanced configuration in the custom element wrapper to support props and events because by default custom elements only support attributes as strings.
- If we need to pass `children` (slots for custom elements) we have to enable `shadow DOM`.
- If we have enabled the `shadow DOM` in the custom element, we need to handle styles consumption too.
- Or more issues like [font-face resources loaded inside shadow DOM does not fetch the related files](https://issues.chromium.org/issues/41085401). As workaround, you can load the font-face in the host application also or load it as base64 inside the shadow DOM.

## Using slots with custom elements

To use slots in our custom elements, we need to update the Vue microfrontend to define the slots:

_./mfe2/src/app.vue_

```diff
<script setup lang="ts">
- import { ref, version } from "vue";
+ import { onMounted, ref, version } from "vue";

const count = ref(0);

+ const slotContainer = ref<HTMLElement | null>(null);
+ onMounted(() => {
+   if (slotContainer.value) {
+     const slot = document.createElement("slot");
+     slot.setAttribute("name", "user-name");
+     slotContainer.value.appendChild(slot);
+   }
+ });
</script>

<template>
  <div>
    <h2>Microfrontend 1</h2>
    <p>This mfe is using Rsbuild and Vue {{ version }}</p>
+   <div ref="slotContainer"></div>
    <button @click="count++">Count is {{ count }}</button>
  </div>
</template>

```

> It's like use `<slot name="user-name"></slot>` but if we use it directly, Vue will try to resolve it as a Vue component slot instead of a native web component slot.

Then, we need to update the host application to pass the slot content:

_./host/src/app.tsx_

```diff
import MFE1 from "mfe1/app";
import React from "react";
import { createCustomElement } from "./vue-wrapper";

createCustomElement("mfe1-app", MFE1);

export const App: React.FC = () => {
+ const [value, setValue] = React.useState("John Doe");
  return (
    <main>
      <h1>Host App</h1>
-     <mfe1-app />
+     <mfe1-app>
+       <input
+         slot="user-name"
+         value={value}
+         onChange={(e) => setValue(e.target.value)}
+       />
+     </mfe1-app>
    </main>
  );
};

```

Enable `shadow DOM` in the custom element wrapper to support slots:

_./host/src/vue-wrapper.ts_

```diff
import { type App, createApp, type VueElement } from "vue";

export const createCustomElement = (
  tagName: string,
  vueElement: VueElement
) => {
  class VueCustomElement extends HTMLElement {
    private app: App<Element> | null = null;

    connectedCallback() {
      if (!this.app) {
+       this.attachShadow({ mode: "open" });
        this.app = createApp(vueElement);
-       this.app.mount(this);
+       this.app.mount(this.shadowRoot as any);
      }
    }

    disconnectedCallback() {
      if (this.app) {
        this.app.unmount();
        this.app = null;
      }
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, VueCustomElement);
  }
};

```

## CSS issues with shadow DOM

If we have styles defined in the Vue microfrontend, they will not be applied because when we load the microfrontend, the styles files are fetched and added to the `head` of the document, but the microfrontend is rendered inside the shadow DOM of the custom element, so the styles are not applied.

Let's how to replicate this issue:

_./mfe2/src/app.vue_

```diff
...
    <button @click="count++">Count is {{ count }}</button>
  </div>
</template>

+ <style scoped>
+ h2 {
+   color: #42b983;
+ }
+ </style>

```

Run the `mfe1` application to verify that everything is working:

```bash
npm start
```

If we check the microfrontend directly, the styles are applied correctly, but if we check the host application, the styles are not applied because they are outside the shadow DOM.

One option is disable the shadow DOM in the custom element wrapper, but we will lose the slots support:

_./host/src/vue-wrapper.ts_

```diff
...
    connectedCallback() {
      if (!this.app) {
-       this.attachShadow({ mode: "open" });
        this.app = createApp(vueElement);
-       this.app.mount(this.shadowRoot as any);
+       this.app.mount(this);
      }
    }
  ...
```

Another option is to force load the styles inside the shadow DOM manually:

_./host/src/vue-wrapper.ts_

```diff
...
    connectedCallback() {
      if (!this.app) {
+       this.attachShadow({ mode: "open" });
        this.app = createApp(vueElement);
-       this.app.mount(this);
+       this.app.mount(this.shadowRoot as any);
+       const links = document.querySelectorAll('link[rel="stylesheet"]');
+       links.forEach((link) => {
+         this.shadowRoot?.appendChild(link.cloneNode(true));
+       });
      }
    }
...
```

# About Basefactor + Lemoncode We are an innovating team of Javascript experts,

passionate about turning your ideas into robust products. [Basefactor,
consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and
coaching services. [Lemoncode](http://lemoncode.net/services/en/#en-home)
provides training services. For the LATAM/Spanish audience we are running an
Online Front End Master degree, more info: http://lemoncode.net/master-frontend
