# Template slot

We can use `<template>` to provide the required HTML for our web components. With `<slot>` we can flexibilize these templates by replacing the parts that we are interested on.

## Step by step

### 1. Using `template`

Update `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Web Components</title>
    <link rel="stylesheet" href="./style.css" type="text/css" />
  </head>
  <body>
    <h1>Web Componentes</h1>
    <p>Custom Element</p>
    <!-- DIFF -->
    <template id="searchbar-template">
      <style>
        .container {
          position: relative;
          padding: 0;
          margin: 0;
          border: 0;
          width: 150px;
          height: 30px;
        }

        .field {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }

        .icons-container {
          position: absolute;
          top: 5px;
          right: -10px;
          width: 30px;
          height: 30px;
        }

        .icon-search {
          position: relative;
          width: 50%;
          height: 50%;
          opacity: 1;
          border-radius: 50%;
          border: 3px solid #c7d0f8;
        }

        .icon-search:after {
          content: "";
          position: absolute;
          bottom: -9px;
          right: -2px;
          width: 4px;
          border-radius: 3px;
          transform: rotate(-45deg);
          height: 10px;
          background-color: #c7d0f8;
        }
      </style>
      <input type="text" placeholder="Search..." class="field" />
      <div class="icons-container">
        <div class="icon-search"></div>
      </div>
    </template>
    <!-- DIFF -->
    <search-bar id="searchbar" ph="buscar..."></search-bar>

    <script src="searchbar.js"></script>
    <script src="main.js"></script>
  </body>
</html>
```

Just to simplify and make easier see the changes lets create a new `custom element` that consumes this new template.

Create `searchbar.template.js`

```js
class SearchBarTemplate extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const template = document.getElementById("searchbar-template");
    const templateContent = template.content;

    const container = document.createElement("div");
    container.setAttribute("class", "container");

    container.appendChild(templateContent.cloneNode(true));
    this.attachShadow({ mode: "open" }).appendChild(container);
  }
}

customElements.define("search-bar-template", SearchBarTemplate);
```

Update `index.html`

```diff
    <search-bar id="searchbar" ph="buscar..."></search-bar>
+   <br>
+   <search-bar-template></search-bar-template>
+
    <script src="searchbar.js"></script>
+   <script src="searchbar.template.js"></script>
    <script src="main.js"></script>
  </body>
```

### 1. Using `slot`

Update `index.html`

```diff
    <template id="searchbar-template">
      # .....
      <input type="text" placeholder="Search..." class="field" />
      <div class="icons-container">
-       <div class="icon-search"></div>
+       <slot name="searchbar-icon-slot">
+         <div class="icon-search"></div>
+       </slot>
      </div>
    </template>
```

Now we can use this `slot` to re write this part on HTML

Update `index.html`

```html
<search-bar-template>
  <!-- diff -->
  <span slot="searchbar-icon-slot">
    <div class="icon-another"></div>
    <style>
      .icon-another {
        position: relative;
        width: 50%;
        height: 50%;
        opacity: 1;
        border-radius: 50%;
        border: 3px solid #cbf8c7;
      }
      .icon-another:after {
        content: "";
        position: absolute;
        bottom: -9px;
        right: -2px;
        width: 4px;
        border-radius: 3px;
        transform: rotate(-45deg);
        height: 10px;
        background-color: #f8c7e9;
      }
    </style>
  </span>
  <!-- diff -->
</search-bar-template>
```

## References

- https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
