# 19 Hot Module Replacement with css

In this demo we are going to start working with css in hmr modules, when you are working on a page and you change a style,
webpack server reloads the whole page and that makes us lose focus or the inputs lose their content, or we lose the console messages, etc.

We will start from sample \_18-hmr-1

Summary steps:

- Install loaders for css
- Modify webpack.config.js
- Create styles.css file

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. If you want to follow this step guides you will need to take as starting point sample \_18-hmr-1.

## Steps

- Install both loaders with the following command:

```bash
npm install --save-dev style-loader css-loader
```

- Now in the _webpack.config.js_ let's update the configuration file to make use of the loader and add.

```diff
+    module: {
+        rules: [
+          {
+            test: /\.css$/,
+            use: ['style-loader', 'css-loader'],
+          },
+        ],
+    },
```

- Create the _styles.css_

```css
.text-color {
  color: red;
}

body {
  background-color: aquamarine;
}
```

- Now is the time to modify _app.js_

```diff
import DIV from './components/div';
+ import './styles.css';

let divComponent = DIV();
+ divComponent.classList.add('text-color');
document.body.appendChild(divComponent);
const input = document.createElement('input');
input.type = 'text';

document.body.appendChild(input);

if (module.hot){
    module.hot.accept('./components/div.js', () =>{
        const newComponent = DIV();
        document.body.replaceChild(newComponent, divComponent);

        divComponent = newComponent;
    })
}
```

- Now we execute the command `npm start`

```bash
npm start
```

- For test it, write something in the input field and change de color in the background-color property in _styles.css_ file, then the page will be updated without lost the input focus

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
