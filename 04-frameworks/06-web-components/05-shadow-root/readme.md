# Shadow Root

An important aspect of custom elements is encapsulation, because a custom element, by definition, is a piece of reusable functionality: it might be dropped into any web page and be expected to work. So it's important that code running in the page should not be able to accidentally break a custom element by modifying its internal implementation. Shadow DOM enables you to attach a DOM tree to an element, and have the internals of this tree hidden from JavaScript and CSS running in the page.

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

+   const shadow = this.attachShadow({ mode: "open" });
    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
-   this.appendChild(style);
-   this.appendChild(container);
+   shadow.appendChild(style);
+   shadow.appendChild(container);
    this.dispacthMyEvent();

    const iconclick = this.iconClickHandler(input);
    iconContainer.onclick = iconclick;
  }
```

If we open now our application on browser, we will find out that the styles are not overrided. Also if we inspect the DOM tree, we will find out the `shadow root` tag.
