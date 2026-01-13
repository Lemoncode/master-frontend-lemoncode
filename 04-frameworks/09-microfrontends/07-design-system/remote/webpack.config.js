const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;

module.exports = {
  entry: "./src/index.js",
  output: {
    publicPath: "http://localhost:3001/",
  },
  resolve: {
    extensions: [".jsx", ".js", ".json"],
  },
  devServer: {
    port: 3001,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    client: {
      overlay: false, // Desactiva el overlay para evitar conflictos con Vite
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
      {
        // CSS global (archivos que NO terminan en .module.css)
        test: /(?<!\.module)\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        // Expresión regular que indica a Webpack
        // qué archivos deben usar esta regla.
        // Solo coincidirá con archivos que terminen en ".module.css"
        test: /\.module\.css$/,
        // Lista de loaders que se aplicarán a esos archivos
        // IMPORTANTE: Webpack los ejecuta de derecha a izquierda
        use: [
          // style-loader:
          // Toma el CSS procesado y lo inyecta en el DOM
          // creando una etiqueta <style> en el <head>.
          // Esto hace que los estilos "viajen" con el JS del remote.
          "style-loader",
          {
            // css-loader:
            // Interpreta el CSS como un módulo JavaScript.
            // Es el responsable de:
            // - entender @import y url(...)
            // - habilitar CSS Modules
            loader: "css-loader",
            // Opciones específicas para css-loader
            options: {
              // Fuerza a css-loader a usar ES Modules
              // En lugar de CommonJS (module.exports)
              //
              // Con esModule: true:
              //   import styles from "./file.module.css"
              //
              // Sin esto (o con false):
              //   const styles = require("./file.module.css")
              //
              // En entornos modernos (React, Vite, MF)
              // ES Modules es lo correcto y evita edge cases
              esModule: true,
              // Formato del nombre de clase generado
              // [name]  → nombre del archivo CSS
              // [local] → nombre original de la clase
              // [hash]  → hash para evitar colisiones
              //
              // Ejemplo:
              // .button en CounterApp.module.css
              // → CounterApp__button__a1B2c
              modules: {
                namedExport: false,
                localIdentName: "[name]__[local]__[hash:base64:5]",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "react_remote",
      filename: "remoteEntry.js",
      exposes: {
        "./CounterApp": "./src/CounterApp.jsx",
      },
      shared: {
        react: {
          singleton: true,
          eager: false,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          eager: false,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./public/index.html",
    }),
  ],
};
