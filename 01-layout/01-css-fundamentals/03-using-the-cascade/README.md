# Module 1 - Layout

# Using the cascade.

## Steps:

### 1. Create a basic HTML

```html
<body>
  <h1>Heading 1</h1>
  <h2>Heading 2</h2>
  <div>A div</div>
  <div>
    <p>A paragraph inside a div</p>
  </div>
  <a href="#">Volver a Menu</a>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway';

### Cascade notes

- The styles that the author you can come from a variety of sources, but there is also two sets of styles included implicitly into every web page.
  - One set of implicit rules comes from the user's stylesheet. Browser will allow a user to create their own stylesheet that the browser will apply to every web page that they view. User stylesheet primarily exist to improve the accesibility of the web.
  - Another set of implicit rules comes from the browser itself. We call this set of rules the default stylesheet, you will also see these styles referred to us as the user agent styles because in the CSS specifications a web browser is called a user agent. These default rules tell the browser the default styles (font, colors, how to display elements...) to apply when there are no other style rules in effect.
- The CSS cascade assigns a weight to each style rule and when several rules could apply to a single element, the rule with the greatest weight will take precedence. The user styles have more weight or more importance than the default styles (user agent styles). So the user style can effectivily override the default styles defined by the browser. Author styles have more importance than the user styles. So the styles that you define as developer (author) in your stylesheets effectively override anything provided by the browser or by the user.

### Related links:

- www.iecss.com/bg
- ie => internet options => General/Accessibility => Format documents with my own stylesheet
- Edge http://stackoverflow.com/questions/32712919/how-do-i-show-microsoft-edges-user-agent-styles
- Edge http://stackoverflow.com/questions/33060628/how-to-attach-user-css-to-microsoft-edge

## Steps:

### 1. We start by applying this css.

```css
@import "https://fonts.googleapis.com/css?family=Raleway";

body {
  /*font-size: 80%;*/
  font-family: "Raleway", sans-serif;
}

h1 {
  font-size: 0.5em;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  color: greenyellow;
}
```

### 2. Lets apply two consecutive styles to the p element, and see what happens.

```css
p {
  background-color: green;
}

p {
  background-color: grey;
}
```

- The winner is grey. Because the browser sees these conflicting rules that come from the same source it just uses the last rule that it sees that would apply to that element.
- The order of rules is significant and this also counts when you are using multiple stylesheets.
