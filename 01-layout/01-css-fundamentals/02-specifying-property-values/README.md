# Module 1 - Layout

# Specifying Property Values

## Steps:

### 1. Create a basic HTML

```html
<body>
  <body>
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <div>A div</div>
    <div>
      <p>A paragraph inside a div</p>
    </div>
    <a href="#">Volver a Menu</a>
  </body>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

### One thing that CSS is not short on is the syntax available to specify property values. Lets see some examples.

## Steps:

### 1. Start by adding a basic css for the html

```css
@import "https://fonts.googleapis.com/css?family=Raleway";

body {
  font-size: 80%;
  font-family: "Raleway", sans-serif;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: greenyellow;
}

p {
}

div {
  width: 50%; /*1*/
}
```

1. The paragraph inside of the div will be 25%, because the p element has to be the 50% relative to its parent, in this case the div.

## Lets play with p element selector to specify values, by using different approachs

### 2. We can use a keyword

```css
p {
  font-size: xx-large;
}
```

### 3. Using points

```css
p {
  font-size: 28pt;
}
```

### 4. Using relative measures

#### Note: With 1.5em will be a 50% bigger than with 1.0em.

```css
p {
  font-size: 1em; /*1.5em*/
}
```

### 5. Lets add some stylish to the p border

```css
p {
  font-size: 1em; /*1.5em*/
  /*diff*/
  border-style: solid;
  border-color: black;
  border-width: thin; /*we can specify using pixels mm cm */
  /*diff*/
}
```

### 6. Just to point this out, the p element has this width because, the div it's its parent and has a 50% width reference to its parent in this case the window

```css
p {
  /*diff*/
  width: 50%;
  /*diff*/
}
/*diff*/
div {
  width: 50%;
}
/*diff*/
```
