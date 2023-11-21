# Custom Element Attributes

The `custom elements` are not closed boxes. We can feed attributes and read them on runtime.

## Step by Step

### 1. Update `index.html`

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    # ....
  </head>
  <body>
    <h1>Web Componentes</h1>
    <p>Custom Element</p>

    <search-bar></search-bar>
+   <br/>
+   <search-bar ph="buscar..."></search-bar>

    <script src="searchbar.js"></script>
  </body>
</html>
```

### 2. Update `searchbar.js`

```diff
class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
-   input.setAttribute("placeholder", "Search...");
+   input.setAttribute("placeholder", this.resolvePlaceholder());
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
+
+ resolvePlaceholder() {
+   const placeholder = this.hasAttribute("ph")
+     ? this.getAttribute("ph")
+     : "Search...";
+   return placeholder;
+ }
```

If we run our code now, we will find out that the `placeholder` is changing depending on `ph` attribute.
