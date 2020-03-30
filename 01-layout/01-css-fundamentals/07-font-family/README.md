# Module 1 - Layout

# Font Family

## Steps:

### 1. Create a basic HTML

```html
<body>
    <h1>Using FileVersionInfo</h1>
    <div class="content">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
            esse cillum dolore eu fugiat nulla pariatur
        </p>
        <p>
            I just discover the FileVersionInfo class from System.Diagnostics
        </p>
        <!--we tell the browser that this is preprocessed code and do not touch it-->
        <pre class="code">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam,
            eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </pre>
        <p>To use the class then, all you need is</p>
        <ol>
            <li>Invoke the static GetVersionInfo method</li>
            <li>Start using the properties of the resulting object</li>
        </ol>
        <p>
            File version is a 64 bit number
            <ul>
                <li>The first 16 bit are the major number</li>
                <li>The next 16 are the minor number</li>
                <li>The third set of 16 bits are the build number</li>
                <li>The last 16 bits are the private build number</li>
            </ul>
        </p>
    </div>
    <div class="copyright">
        Include icon using UTF-8
        Copyright
        &copy
    </div>
</body>
```

#### Note: For demos we will use an online font: @import 'https://fonts.googleapis.com/css?family=Raleway'; Not used in this example

### Font Family Notes

#### Font Collections

- In CSS you can select the font you want to use for the text inside of a particular element by setting the font-family property in a style rule.

```css
body {
  font-family: sans-serif;
}
```

- We can not be sure that all devices that users will have will have the same fonts available because specific fonts are not defined by the web standards and web browser it's going to rely on the user's system, to provide them with the fonts that we request.

| Family Name     | Collection Name/ Category |
| :-------------- | :-----------------------: |
| Times New Roman |           serif           |
| Arial           |        sans-serif         |
| Comic Sans      |          cursive          |
| Impact          |          fantasy          |
| Courier New     |         monospace         |

#### Font Families

- Many CSS design will set the font-family property to the name of a specific font like Arial. However, there is always a chance that the specific fon you want, like Arial, that it is not available on a give user's system. And that is one of the reasons you can specify as many fonts you would like in a comma delimited list and the browser will use the first one that matches.

> Reference: https://christopheraue.net/design/vertical-align

- `The inline element’s baseline is the line`, the characters are sitting on. Roughly speaking, the baseline is somewhere below the middle of the font’s height.

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

#### Font Sizing and Styles

- Another characteristic of fonts that you will want to control is the size and when setting the size you will first have to pick between absolute or relative units. Absolute sizes are commonly specified on pixels. Relative units, like percentages or the keywords larger or smaller or ems, they allow you set a font size based on baseline, so 2em would be the double size of the baseline and 0.8 em would be the 80% of the baseline.

Reference to baseline: https://www.smashingmagazine.com/2012/12/css-baseline-the-good-the-bad-and-the-ugly/

Reference to height line:
https://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align

JS Fiddle:
https://jsfiddle.net/rcp47hm4/6/

```css
body {
  font-family: sans-serif;
  font-size: 1.1em;
  font-style: italic;
  font-weight: bold;
  font-variant: small-caps; /*Use only capital letters*/
}
```

## Steps:

### 1. We start by applying this css.

```css
* {
  padding: 0;
  margin: 0;
}

body {
  font-family: sans-serif;
  background: #ccff99;
}
```

### 2. We can include UTF8 icons

```diff
+.copyright {
+    font-weight: bold;
+    font-size: 0.8em;
+}
```

### 3. The pre tag is a really interisting html element. It will recognize identation and line jumps.

```diff
+.code {
+    font-family: monospace;
+    font-size: 0.9em;
+}
```

### 4. Browser will ignore font families that does not exist.

```diff
+    h1 {
+    font-family: fontdoesnotexist, 'Times New Roman', serif;
+    font-size: 1.2em;
+    /*letter-spacing: 2em;*/
+    /*word-spacing: 2em;*/
+    /*text-decoration: underline line-through;*/
+    text-align: center;
+}
```

### 5. Of course we can write group font properties using the font keyword

```diff
+ol {
+    /*font: italic 0.9em serif;*/
+    font-style: italic;
+    font-size: 0.9em;
+}
```

### 6. We can play with space between lines using line-height. The identation of text with text-indent and for last with text-align we can play how text is going to be distribute horizontally.

```diff
+.content {
+    background: #eeeecc;
+    padding: 7px;
+    line-height: 1.2em; /*Space between text lines*/
+    /*text-indent: 3em;*/
+    text-align: justify; /*Makes the content to be the closest +as posible to the margin*/
+}
```
