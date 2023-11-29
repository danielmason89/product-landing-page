const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let production = process.env.NODE_ENV === "production";

let config = {
  mode: "development",
  devServer: {
    liveReload: true,
    watchFiles: ["src/**/* css/**/*"],
    static: "./dist",
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"] },
        },
      },
      {
        test: /\.css$/,
        exclude: /node-modules/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [],
};

if (production) {
  (config.mode = "production"), (config.devtool = "eval");
}

module.exports = config;
