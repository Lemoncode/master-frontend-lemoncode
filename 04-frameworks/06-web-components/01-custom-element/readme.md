# Custom Element

In this first demo we're going to introduce the `custom element`.

## Introduction

One of the key features of web components is the ability to create **custom elements**: that is, HTML elements whose behavior is defined by the web developer, that extend the set of elements available in the browser.

## Step by Step

### 1. Create `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Web Components</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <h1>Web Componentes</h1>
    <p>Custom Element</p>
  </body>
</html>
```

### 2. Create `searchbar.js`

```js
class SearchBar extends HTMLElement {
  constructor() {
    super();
    console.log("I am the constructor of SearchBar");
  }
}

customElements.define("search-bar", SearchBar);
```

Here we're defining a new `custom element`, in order to use it, we need that the HTML document declares `search-bar` in some way. The easiest way to do this, is uing on `HTML`

### 3. Consume `searchbar.js`

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    # ....
  </head>
  <body>
    <h1>Web Componentes</h1>
    <p>Custom Element</p>
+
+   <search-bar></search-bar>
+
+   <script src="searchbar.js"></script>
  </body>
</html>
```

If we run now our code, and open the developer tools, we must see a mesasge on console.

### 4. Update `searchbar.js`

Ok, we get a message on console, but we want that our custom element, renders something. We're going to use JavaScript, to achieve this:

```diff
class SearchBar extends HTMLElement {
  constructor() {
    super();
-   console.log("I am the constructor of SearchBar");
  }
```

```js
class SearchBar extends HTMLElement {
  constructor() {
    super();
    /*diff*/
    this.render();
    /*diff*/
  }

  /*diff*/
  render() {
    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Search...");
    input.setAttribute("class", "field");

    const iconContainer = document.createElement("div");
    iconContainer.setAttribute("class", "icons-container");

    const iconSearch = document.createElement("div");
    iconSearch.setAttribute("class", "icon-search");

    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    this.appendChild(container);
  }
  /*diff*/
}

customElements.define("search-bar", SearchBar);
```

If we inspect the developer tools we're able to see inside `search-bar`, the new created elements.

### 5. Create `style.css`

```css
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
```
