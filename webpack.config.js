const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript").default;

function makeConfig(mode) {
  const isDevelopment = mode !== "production";

  return {
    mode,
    entry: "./src/index.tsx",
    output: {
      filename: "[name].[hash].js",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                additionalData: '@import "containers/assets/global.scss";',
              },
            },
          ],
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
              options: {
                getCustomTransformers: () => ({
                  before: [ReactRefreshTypeScript()],
                }),
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", "json"],
    },
    plugins: [
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
        filename: "index.html",
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ].filter(Boolean),
    devServer: {
      hot: true,
      disableHostCheck: true,
      historyApiFallback: true,
      contentBase: path.join(__dirname, "src"),
      compress: true,
      port: 3000,
    },
    devtool: "source-map",
  };
}

module.exports = (env, argv) => {
  return makeConfig(argv.mode);
};
