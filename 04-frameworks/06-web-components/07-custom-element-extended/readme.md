# Custom Element Extended

Right now we're extending from the simplest element that we can extend `HTMLElement`, but we can extend from more sophisticated classes.

## Step by step

### 1. Update `searchbar.js`

```diff
-class SearchBar extends HTMLElement {
+class SearchBar extends HTMLDivElement {
```

If we open our application, it's not working... If we inspect the developer tools we will find the reason:

```
searchbar.js:52 Uncaught TypeError: Illegal constructor: autonomous custom elements must extend HTMLElement
```

In order to make it work, we need to update `customElements.define` arguments:

```diff
-customElements.define("search-bar", SearchBar);
+customElements.define("search-bar", SearchBar, { extends: "div" });
```

If we run our code now, we will notice that the error has gone. But the `search-bar` component, is not rendering. Well since we are exteding from `HTMLDivElement` we must refer as a `div` instead a custom element. For this purpose we can use the `is` attribute:

Update `index.html`

```diff
  <body style="font-family: Arial, Helvetica, sans-serif">
    <h1>Web Componentes</h1>
    <p>Custom Element</p>

    <search-bar id="searchbar" ph="buscar..."></search-bar>
+   <div is="search-bar"></div>
    <script type="module" src="searchbar.js"></script>
    <script type="module" src="main.js"></script>
  </body>
```

## Reference

- [Extending Native Elements](https://dev.to/danieldekel/extending-native-elements-4h31)
- [Registering a custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#registering_a_custom_element)
