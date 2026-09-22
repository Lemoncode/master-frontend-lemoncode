# how o sync up attributes and properties in web components

Syncing attributes and properties in web components involves using lifecycle methods to reflect changes from HTML attributes to JavaScript properties (one-way sync), while avoiding the reverse for performance reasons. [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)

## Core Steps
Define a static `observedAttributes` getter to list attributes you want to watch, then implement `attributeChangedCallback` to update the corresponding property when the attribute changes. [thomaswilburn.github](https://thomaswilburn.github.io/wc-book/ce-lifecycle.html)

Use a private field or backing property to store the value, parsing the attribute string as needed (e.g., convert to boolean or number). [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)

Initialize the property in the constructor or `connectedCallback` by reading the attribute. [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)

## Example Code
```javascript
class MyElement extends HTMLElement {
  static get observedAttributes() {
    return ['open', 'count'];
  }

  #open = false;  // Private backing property
  #count = 0;

  constructor() {
    super();
    this.#open = this.hasAttribute('open');
    this.#count = parseInt(this.getAttribute('count') || '0', 10);
  }

  get open() {
    return this.#open;
  }

  get count() {
    return this.#count;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this.#open = newValue !== null;
      this.#updateDisplay();
    } else if (name === 'count') {
      this.#count = parseInt(newValue || '0', 10);
      this.#updateDisplay();
    }
  }

  #updateDisplay() {
    // React to changes, e.g., toggle visibility
    this.style.display = this.#open ? 'block' : 'none';
    this.textContent = `Count: ${this.#count}`;
  }
}

customElements.define('my-element', MyElement);
```
This setup ensures attribute changes like `<my-element open count="5">` update properties automatically. [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)

## Best Practices

- Sync only attribute → property, not property → attribute, to prevent unnecessary DOM mutations. [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)
- Handle booleans carefully: presence means true, use `hasAttribute` or check `newValue !== null`. [open-wc](https://open-wc.org/guides/knowledge/attributes-and-properties/)
- For two-way sync (rare), add getters/setters that call `setAttribute` but watch for loops. [abeautifulsite](https://www.abeautifulsite.net/posts/reflection-and-custom-states-in-web-components/)

---

# how to sync up attributes and properties web components

Syncing attributes and properties in web components requires a bidirectional approach: reflecting property changes down to attributes, and observing attribute changes up to properties. Use JavaScript getters/setters for property-to-attribute updates and attributeChangedCallback for attribute-to-property updates, ensuring data stays consistent and behaves like native HTML elements.

## Key Techniques for Synchronization

- **Property to Attribute (Reflection):** When a JavaScript property changes, update the corresponding HTML attribute using `this.setAttribute()` within a setter.
- **Attribute to Property:** Use `static get observedAttributes()` to track changes, and `attributeChangedCallback(name, oldVal, newVal)` to update the corresponding property.
- **Getters and Setters**: Add getters and setters to your custom element class to handle this reflection seamlessly.

## Implementation Example

```js
class MyElement extends HTMLElement {
  constructor() {
    super();
    this._value = ''; // Internal state
  }

  // 1. Observe the attribute
  static get observedAttributes() {
    return ['value'];
  }

  // 2. Sync attribute change to property
  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[name] = newVal; // Calls the setter
    }
  }

  // 3. Setter: Sync property change to attribute
  set value(val) {
    if (this._value === val) return;
    this._value = val;
    // Reflect back to attribute
    if (this._value) {
      this.setAttribute('value', this._value);
    } else {
      this.removeAttribute('value');
    }
    // Update component UI here
  }

  get value() {
    return this._value;
  }
}
customElements.define('my-element', MyElement);

```

## Best Practices

- **Avoid Infinite Loops:** Always check if the new value is different from the old value before updating in both setters and `attributeChangedCallback`.
- **Handle Data Types:** Attributes are strings, so parse (e.g., JSON.parse) JSON data when receiving it in `attributeChangedCallback` and stringify it when setting attributes.
- **Reflect Primitive Types:** Only reflect primitives (strings, booleans, numbers) to attributes; do not reflect complex objects or arrays as attributes.
- **Use dataset:** For custom data attributes, use `this.dataset` for easier manipulation.

---

# References

- https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements
- https://nolanlawson.com/2024/01/13/web-component-gotcha-constructor-vs-connectedcallback/
- https://hawkticehurst.com/2023/11/you-are-probably-using-connectedcallback-wrong/