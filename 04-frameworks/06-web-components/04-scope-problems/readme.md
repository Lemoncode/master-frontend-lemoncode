# Scope Problems

Right now we are consuming the custom element styles from `index.html`. Since we're creating a custom element, we want to contol an isolate the custom element from main doucument styles.

## Step by step

### 1. Embed styles on `custom elements`

Ok, lets go with our first approach, lets embed the styles into the `custom element`.

Update `searchbar.js`

```js
const eventFact = (eventName, options) => new CustomEvent(eventName, options);
/*diff*/
const getStyles = () => `
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
`;
/*diff*/
```

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

+   const style = document.createElement('style');
+   style.textContent = getStyles();

    iconContainer.appendChild(iconSearch);
    container.appendChild(input);
    container.appendChild(iconContainer);
+   this.appendChild(style);
    this.appendChild(container);
    this.dispacthMyEvent();

    const iconclick = this.iconClickHandler(input);
    iconContainer.onclick = iconclick;
  }
```

Update `style.css`

> Commnet out the code our simply remove it.

Ok, lets open on browser. If we open the developer tools we will find embeded the `style` tag, that is feeding the styles for the custom element.

### 2. Overriding styles

But, this is not going to work as far as the `css bleeding` still happening.

Update `style.css`

```css
.container input {
  width: 800px;
}
```

If we open again the browser, we will find out that the external css rule has a bigger specificity, so we're overriding our styles.
