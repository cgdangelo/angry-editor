/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const srcPath = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');

module.exports = {
  context: __dirname,
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
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },

      {
        test: /\.s?css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap!sass?sourceMap',
      }
    ]
  },
  devtool: 'inline-source-map',
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
