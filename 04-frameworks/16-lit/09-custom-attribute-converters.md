# Custom attribute converters

Web Components can receive data in many ways, but one of the most common ways is to use an attribute because attributes are declarative, static, and easy to read & write in HTML!

Every HTML element in the browser has attributes and properties:

- [Attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) are additional values that describe the state of an element in HTML. Attributes can only have string values.

- [Properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) are the instance properties of an element's JavaScript DOM object. Properties can take any kind of value, like numbers, booleans, and arrays.

Built-in elements often match a property with a similarly-named attribute. For example, the `<input>` element has both a `value` attribute and a `value` property.

```html
<input value="This is setting the 'value' attribute" />
<script>
  const inputElementReference = document.querySelector("input");
  inputElementReference.value = 'This is setting the "value" property';
</script>
```

Setting the `value` attribute also sets the `value` property, so you can set a default value for your input from static markup.

Lit elements are HTML elements, Lit elements have both attributes and properties. When you define a [reactive property](https://lit.dev/docs/components/properties/), you can set up an attribute that maps to your property, and specify how the attribute value is converted to a property value.

Create `src/date-display.ts`

```ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("date-display")
export class DateDisplay extends LitElement {
  @property()
  date = new Date();

  protected override render() {
    const locale = "en-US";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    console.log(this.date, locale, options);
    return html` <p>The given date is:</p> `;
  }
}
```

```bash
npm run build
```

Update `dev/index.html`

```diff
....
-   <script type="module" src="../dist/mirror-text.js"></script>
+   <script type="module" src="../dist/date-display.js"></script>
    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
      }
    </style>
  </head>
  <body>
-   <mirror-text></mirror-text>
+   <date-display date="06/06/1987"></date-display>
  </body>
....
```

> Check in browser

Notice that `date` property gets the value from html attribute, and it is plain text not a Date object.

Update `src/date-display.ts`

```diff
protected override render() {
    const locale = "en-US";
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
-   console.log(this.date, locale, options);
+   return html`
+     <p>The given date is: ${this.date.toLocaleDateString(locale, options)}</p>
+   `;
  }
```

Update `dev/index.html`

```diff
....
  <body>
-   <date-display date="06/06/1987"></date-display>
+   <date-display></date-display>
+   <script>
+     const dateDisplay = document.querySelector("date-display");
+     dateDisplay.date = new Date("06/06/1987")
+   </script>
  </body>
....
```

> Check in browser

The `date` property **can't** be set from an attribute, because Lit doesn't have a built-in attribute converter to convert a string date to a `Date` object.

Attribute converters tell Lit how to convert an attribute to a property and, in the case that a reactive property has the `reflect: true` flag, from property to attribute.

Lit has several built-in attribute converters:

- String
- Boolean
- Number
- Array
- Object

Update `src/date-display.ts`

```diff
....
export class DateDisplay extends LitElement {
  @property({attribute: false})
  date = new Date();

+ @property({type: String, attribute: 'date-str'})
+ dateStr = '';
  ...
```

## Update `date` when `dateStr` changes

Update `src/date-display.ts`

```diff
...
export class DateDisplay extends LitElement {
  ...
+
+ protected override willUpdate(_changedProperties: PropertyValues): void {
+   if (_changedProperties.has("dateStr")) {
+     this.date = new Date(this.dateStr);
+   }
+ }
+
  ...
```

Update `dev/index.html`

```diff
....
-   <date-display></date-display>
+   <date-display date-str="06/06/1987"></date-display>
-   <script>
-     const dateDisplay = document.querySelector("date-display");
-     dateDisplay.date = new Date("06/06/1987")
-   </script>
....
```

> The `willUpdate` method is a good place to reconcile two different reactive properties.

Adding the `dateStr` property and imperative code in `willUpdate()` _works_, but it's not ideal.

> Instead, you should use a custom attribute converter.

## Defining a custom attribute converter

Create `src/date-converter.ts`

```ts
import type { ComplexAttributeConverter } from "lit";

export const dateConverter = (
  locale: string
): ComplexAttributeConverter<Date> => {
  return {
    toAttribute: (date: Date) => {
      return date.toLocaleDateString(locale);
    },
    fromAttribute: (value: string) => {
      return new Date(value);
    },
  };
};
```

Update `src/date-display.ts`

```diff
....
+import {dateConverter} from './date-converter.js';

export class DateDisplay extends LitElement {
- @property({attribute: false})
+ @property({converter: dateConverter(navigator.language), reflect: true})
  date = new Date();

- @property({type: String, attribute: 'date-str'})
- dateStr = '';
  ...
```


- Import the `dateConverter` from `date-converter.ts`.
- Set `converter` on the date reactive property option to an invocation of `dateConverter`.
    - Pass the `navigator.language` string as an argument.
- Enable attribute conversion for `date` by removing `attribute: false`.
- Enable the property to be reflected back to the attribute by setting `reflect: true`.

We can also remove `willUpdate`, we do not need it any more and compiler claims to remove it.

```diff
...
export class DateDisplay extends LitElement {
  ...
-
- willUpdate(changed: PropertyValues<this>) {
-   if (changed.has('dateStr') && this.dateStr) {
-     this.date = new Date(this.dateStr);
-   }
- }
-
  ...
```

```bash
npm run dev
```

Update `dev/index.html`

```diff
....
  <body>
-   <date-display date-str="06/06/1987"></date-display>
+   <date-display date="06/06/1987"></date-display>
  </body>
....
```