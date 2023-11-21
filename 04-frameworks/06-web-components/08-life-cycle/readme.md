# The custom element lifecycle

If we have a look into our `custom element`, we will notice that we're initializing the DOM inside the constructor, but we're not really manipulating the DOM.

The DOM manipulation is something that we will align to `lifecycle callbacks`

## connectedCallback

The connectedCallback method is run whenever your element gets attached to the document, either by the HTML parser or by any JavaScript that appends it to a parent element. This is where you probably want to put most of your actual setup code, but be aware that `connectedCallback` can be run multiple times if your element is moved around.

Set up for HTML template and events.

## disconnectedCallback

As the name implies, this method gets called when your element is disconnected from the document. It's a good place to put any cleanup code: removing observers or event listeners that might have been added in `connectedCallback()`. Don't assume that this will be called once for each connectedCallback(), either before or after.

## attributeChangedCallback

`attributeChangedCallback()` is called whenever an attribute is added, removed, or altered on your element. This can happen in several scenarios:

- During regular HTML parsing, for each attribute in the markup source
- Via `setAttribute()` calls in scripts
- When a user edits your element attributes from dev tools

Not every attribute will trigger this lifecycle method. In order to get notifications about attribute changes, your element class needs to declare a static `observedAttributes` getter that returns an array of attribute names.

```js
static get observedAttributes() {
  return [ "src", "title" ]
}
```

## Step by step

### 1. Using `connectedCallback`

Update `searchbar.js`

```diff
-class SearchBar extends HTMLDivElement {
+class SearchBar extends HTMLElement {

  constructor() {
    super();
-   this.render();
    this.iconClickHandler = this.iconClickHandler.bind(this);
  }
+
+ connectedCallback() {
+   console.log("call connected callback");
+   this.render();
+ }
  // ....
}

-customElements.define('search-bar', SearchBar, { extends: 'div' });
+customElements.define("search-bar", SearchBar);

```

### 2. Using `disconnectedCallback`

```diff
class SearchBar extends HTMLElement {
  # ....

  connectedCallback() {
    console.log("call connected callback");
    this.render();
  }
   
  # ....

+ disconnectedCallback() {
+   console.log('disconnected called');
+ }
}
```

Open the developer tools and run the following code:

```js
const element = document.querySelector('search-bar');
document.body.removeChild(element);
```

As we can notice the message appears on console.

### 3. Using `attributeChangedCallback`

Ok time update attibutes from outside the custom element. What we want to do is to be able to change `ph` attribute from dev tools and get reflected on browser.

```diff
class SearchBar extends HTMLElement {
  constructor() {
    super();
    this.iconClickHandler = this.iconClickHandler.bind(this);
  }
+
+ static get observedAttributes() {
+   return ["ph"];
+ }
+
+ attributeChangedCallback(name, oldValue, newValue) {
+   console.log('search-bar updated', name, oldValue, newValue);
+ }
+
  connectedCallback() {
    console.log("call connected callback");
    this.render();
  }
```

If we move into the developer tools, we can see the message on console.

For last we can update the previous code to change the placeholder value

```js
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("search-bar updated", name, oldValue, newValue);
    /*diff*/
    if (this.shadowRoot) {
      const input = this.shadowRoot.querySelector(".container > input");
      input.setAttribute('placeholder', newValue);
    }
    /*diff*/
  }
```