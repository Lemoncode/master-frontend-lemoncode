# Shadow Root closed

With mode set to "open", the JavaScript in the page is able to access the internals of your shadow DOM through the [`shadowRoot`](https://developer.mozilla.org/en-US/docs/Web/API/Element/shadowRoot) property of the shadow host.

But if we set this property to "closed", it will deny access to the node(s) of a closed shadow root from JavaScript outside it:

```js
element.attachShadow({ mode: "closed" });
element.shadowRoot; // Returns null
```

## Step by step

### 1. Update `searchbar.js`

```diff
  render() {
    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", this.resolvePlaceholder());
    input.setAttribute("class", "field");

    const iconContainer = document.createElement("div");
    iconContainer.setAttribute("class", "icons-container");

    const iconSearch = document.createElement("div");
    iconSearch.setAttribute("class", "icon-search");

    const style = document.createElement("style");
    style.textContent = getStyles();

-   const shadow = this.attachShadow({ mode: "open" });
+   const shadow = this.attachShadow({ mode: "closed" });
    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    shadow.appendChild(style);
    shadow.appendChild(container);
    this.dispacthMyEvent();

    const iconclick = this.iconClickHandler(input);
    iconContainer.onclick = iconclick;
  }
```

Open developer tools:

```js
const element = document.querySelector("search-bar");
element.shadowRoot; // null
```

As we can see, we're not able to interact with the elements inside this shadow DOM.

Let's back to open:

```diff
  render() {
    const container = document.createElement("div");
    container.setAttribute("class", "container");

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", this.resolvePlaceholder());
    input.setAttribute("class", "field");

    const iconContainer = document.createElement("div");
    iconContainer.setAttribute("class", "icons-container");

    const iconSearch = document.createElement("div");
    iconSearch.setAttribute("class", "icon-search");

    const style = document.createElement("style");
    style.textContent = getStyles();

-   const shadow = this.attachShadow({ mode: "closed" });
+   const shadow = this.attachShadow({ mode: "open" });
    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    shadow.appendChild(style);
    shadow.appendChild(container);
    this.dispacthMyEvent();

    const iconclick = this.iconClickHandler(input);
    iconContainer.onclick = iconclick;
  }
```

If we open the developer tools and run the same code again:

```js
const element = document.querySelector("search-bar");
element.shadowRoot.childNodes; // NodeList(2) [style, div.container]
```
