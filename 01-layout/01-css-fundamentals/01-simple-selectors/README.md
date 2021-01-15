# Module 1 - Layout

# Simple Selectors

## Steps:

### 1. Create a basic HTML

```html
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <div>A div</div>
  <p>A paragraph</p>
  <div>
    <p>A paragraph inside a div</p>
  </div>
  <p id="content">A paragraph hit by id selector</p>
  <p class="quotation">A paragraph hit by class</p>
  <a href="#">I am a link!!!</a>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

### 2. We can select elments by tag name.

```css
body {
  font-size: 80%;
  font-family: "Raleway", sans-serif;
  background-color: yellowgreen;
}

a {
  text-decoration: none;
  color: black;
  background-color: rgba(255, 0, 0, 0.5);
}
```

### 3. Another important feature is the use of pseudo clases. A pseudo class defines a state of a HTML element. For example we can have an anchor (a tag) when user clicks on anchor the state of the anchor changes to visited. We can target such pseudo classes in CSS (:hover, :focus)

```css
a:hover {
  color: white;
}
```

### 4. We can target multiple elements using the ',' separator. In this case we are using just simple tag elements selectors, but we can use other kind of selectors here.

```css
h1,
h2 {
  background-color: yellow;
}
```

> NOTE ### 5. Just for introduce the concept, here we can think that p rule overrides div style rule.

### 5. The selector rule gets applied even when the HTML element it's nested inside another HTML element. There is more going on here but we will discuss it later.

```html
<div>
  <p>A paragraph inside a div</p>
</div>
```

```css
div {
  background-color: red;
}

p {
  background-color: aqua;
}
```

### 6. Another simple selector is the id selector

```css
#content {
  background-color: green;
}
```

### 7. And for last the class selector

```css
.quotation {
  background-color: blueviolet;
}
```
