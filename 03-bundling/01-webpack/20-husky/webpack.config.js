const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
          },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Webpack dev server"
        })
    ],
    devServer: {
        port: 8085,
        contentBase: './dist',
        hot:true
    }
}