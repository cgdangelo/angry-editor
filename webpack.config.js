/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');

module.exports = {
  entry: [
    'babel-polyfill',
    './src'
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    moduleDirectories: ['node_modules']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },
  devtool: 'eval-source-map',
  output: {
    path: buildPath,
    filename: '[name]-[chunkhash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ],
  devServer: {
    inline: true
  }
};
/* eslint-enable */
