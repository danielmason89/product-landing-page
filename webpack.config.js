const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyPlugIn = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

let production = process.env.NODE_ENV === "production";

let config = {
  mode: "development",
  devServer: {
    liveReload: true,
    watchFiles: ["src/**/* css/**/*"],
    open: true,
    hot: true,
    static: "./dist",
    // proxy: {
    //   "/api": {
    //     target: "",
    //   },
    // },
  },
  entry: {
    main: path.resolve(__dirname, "src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      // Javascript
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"], compact: false },
        },
      },
      // *** HTML ***
      // {
      //   test: /\.html$/,
      //   exclude: /node-modules/,
      //   use: ["html-loader"],
      // },
      // *** CSS ***
      {
        test: /\.css$/i,
        exclude: /node-modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      // *** Images/Assets ***
      {
        test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      title: "Home",
      template: path.resolve(__dirname, "src/index.html"),
      filename: "index.html",
    }),
    new HtmlWebpackPlugin({
      title: "Blog",
      template: path.resolve(__dirname, "src/blog.html"),
      filename: "blog.html",
    }),
    new HtmlWebpackPlugin({
      title: "Quiz",
      template: path.resolve(__dirname, "src/quiz.html"),
      filename: "quiz.html",
    }),
    new HtmlWebpackPlugin({
      title: "Login",
      template: path.resolve(__dirname, "src/login.html"),
      filename: "login.html",
    }),
    new HtmlWebpackPlugin({
      title: "Signup",
      template: path.resolve(__dirname, "src/signup.html"),
      filename: "signup.html",
    }),
    new HtmlWebpackPlugin({
      title: "Shop",
      template: path.resolve(__dirname, "src/shop.html"),
      filename: "shop.html",
    }),
    new HtmlWebpackPlugin({
      title: "Checkout",
      template: path.resolve(__dirname, "src/checkout.html"),
      filename: "checkout.html",
    }),
  ],
};

if (production) {
  (config.mode = "production"), (config.devtool = "eval");
}

module.exports = config;
