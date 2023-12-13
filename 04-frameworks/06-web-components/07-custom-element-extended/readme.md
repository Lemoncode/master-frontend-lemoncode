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

## Reference

- https://dev.to/danieldekel/extending-native-elements-4h31
