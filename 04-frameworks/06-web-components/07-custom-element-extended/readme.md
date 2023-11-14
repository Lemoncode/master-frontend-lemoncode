# Custom Element Extended

Right now we're extending from the simplest element that we can extend `HTMLElement`, but we can extend from more sophisticated classes.

## Step by step

### 1. Update `searchbar.js`

```diff
-class SearchBar extends HTMLElement {
+class SearchBar extends HTMLDivElement {
```
