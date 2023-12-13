# Custom Element Events

We can define events inside our `custom elements` and consume them on other DOM elements. This is great, because combine with attributes, we get a full message mechanism, for `custom elements`.

## Step by step

### 1. Update `searchbar.js`

```js
/*diff*/
const eventFact = (eventName, options) => new CustomEvent(eventName, options);
/*diff*/

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
    input.setAttribute("placeholder", this.resolvePlaceholder());
    input.setAttribute("class", "field");

    const iconContainer = document.createElement("div");
    iconContainer.setAttribute("class", "icons-container");

    const iconSearch = document.createElement("div");
    iconSearch.setAttribute("class", "icon-search");

    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    this.appendChild(container);
    /*diff*/
    this.dispacthMyEvent();
    /*diff*/
  }

  resolvePlaceholder() {
    const placeholder = this.hasAttribute("ph")
      ? this.getAttribute("ph")
      : "Search...";
    return placeholder;
  }
  /*diff*/
  dispacthMyEvent() {
    const myEvent = eventFact("myEvent", {
      bubbles: true, // [1]
      cancelable: false, // [2]
      composed: true, // [3]
      detail: { name: "Joe", text: "hello" },
    });
    setTimeout(() => {
      this.dispatchEvent(myEvent);
    }, 5_000);
  }
  /*diff*/
}

customElements.define("search-bar", SearchBar);
```

1. [Event: bubbles property](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles)
2. [Event: cancelable property](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable)
3. [Event: composed property](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed)

### 2. Create `main.js`

```js
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("myEvent", (event) => {
  console.log("Event listened!!", event);
});
```

### 3. Update `index.html`

```diff
<!DOCTYPE html>
<html lang="en">
  <head>
    # ....
  </head>
  <body>
    <h1>Web Componentes</h1>
    <p>Custom Element</p>

-   <search-bar></search-bar>
-   <br/>
-   <search-bar ph="buscar..."></search-bar>
+   <search-bar id="searchbar" ph="buscar..."></search-bar>

    <script src="searchbar.js"></script>
+   <script src="main.js"></script>
  </body>
</html>
```

If we open our dev tools, we will see the event on console.

We can also re throw, events that happen inside our custom element, for example, lets say that we want to notify other DOM elements, whenever the search icon is clicked.

### 4. Update `searchbar.js`

```js
const eventFact = (eventName, options) => new CustomEvent(eventName, options);

class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.render();
    /*diff*/
    this.iconClickHandler = this.iconClickHandler.bind(this);
    /*diff*/
  }

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

    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
    this.appendChild(container);
    this.dispacthMyEvent();
    /*diff*/
    const iconclick = this.iconClickHandler(input);
    iconContainer.onclick = iconclick;
    /*diff*/
  }

  resolvePlaceholder() {
    const placeholder = this.hasAttribute("ph")
      ? this.getAttribute("ph")
      : "Search...";
    return placeholder;
  }

  dispacthMyEvent() {
    const myEvent = eventFact("myEvent", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { name: "Joe", text: "hello" },
    });
    setTimeout(() => {
      this.dispatchEvent(myEvent);
    }, 5_000);
  }

  /*diff*/
  iconClickHandler = (inputRef) => () => {
    const myEvent2 = new CustomEvent("myEvent2", {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: { value: inputRef.value },
    });
    this.dispatchEvent(myEvent2);
  };
  /*diff*/
}

customElements.define("search-bar", SearchBar);
```

### 5. Update `main.js`

```diff
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("myEvent", (event) => {
  console.log("Event listened!!", event);
});
+
+searchbar.addEventListener("myEvent2", (event) => {
+  console.log("Event listened!!", event);
+});
+
```
