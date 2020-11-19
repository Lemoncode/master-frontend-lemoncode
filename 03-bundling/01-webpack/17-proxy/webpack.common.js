const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const basePath = __dirname;

module.exports = {

  context: path.join(basePath, "src"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  entry: {
    app: ["./index.tsx"],
    appStyles: ["./mystyles.scss"],
    vendorStyles: ["../node_modules/bootstrap/dist/css/bootstrap.css"],
  },
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              import: false,
              modules: {
                exportLocalsConvention: "camelCase",
                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                localIdentContext: path.resolve(__dirname, "src"),
                localIdentHashPrefix: "my-custom-hash",
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html", //Name of file in ./dist/
      template: "index.html", //Name of template in ./src
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        //The origin of the host header is kept when proxying by default: if true to override this behaviour. 
        //Use when is name-based hosted sites.
        "changeOrigin": true,
        //If you don't want /api to be passed along, we need to rewrite the path:
        pathRewrite: { "^/api": "" },
        // If you want filter the request  type 
        bypass: function(req, res, proxyOptions) {
          if(req.method != 'GET') return false;
        }
      },
      "/get": {
        //The origin of the host header is kept when proxying by default: if true to override this behaviour. 
        //Use when is name-based hosted sites.
        "changeOrigin": true,
        //If you don't want /api/get to be passed along, we need to rewrite the path:
        pathRewrite: { "^/api/get": "" },
        // If you want filter the request  type 
        bypass: function(req, res, proxyOptions) {
          if(req.method != 'GET') return false;
        }
      }
    }
  }
};
