# 18 Hot Module Replacement

In this demo we are going to configure Webpack Hot Module Replacement, when you are working on a page and you change something like a paragraph, 
webpack server reloads the whole page and that makes us lose focus or the inputs lose their content, or we lose the console messages, etc. 

We will start from empty project

Summary steps:

- Init the project
- Install webpack and configure it
- Create app.js file
- Create components folder and div.js file inside

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed in your computer. 

## Steps

- Init the project

```bash
npm init -y
```

- Install webpack, webpack dev server and html webpack plugin

```bash
npm i -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```

- In the package.json create this script

```javascript
"start": "webpack serve --mode development"
```

- And now create the file _webpack.config.js_ with this configuration, very important to add in the dev server configuration the property hot at true

```
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack dev server"
        })
    ],
    devServer: {
        port: 8085,
        static: "./dist",
        hot:true
    }
}
```

- Create _app.js_, Important the if(module.hot), when a change is detected we tell webpack to accept the updated module

```javascript
import DIV from './components/div';

let divComponent = DIV();
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

- Create components folder and _div.js_ file

```javascript
export default content => {
    
    const div = document.createElement('div');
    
    div.innerHTML = 'Testing Hot Module Reload';

    return div;
}
```

- Now we execute the command `npm start`

```bash
npm start
```

- For test if is working we can write in the input text and change the text in _div.js_,
when we save the changes the text will be updated and don't loose the input focus

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
