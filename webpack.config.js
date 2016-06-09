/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    app: './src'
  },
  devtool: 'eval-source-map',
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name]-[chunkhash].js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  devServer: {
    inline: true
  }
};
/* eslint-enable */
