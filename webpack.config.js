/* eslint-disable */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const config = {
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
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      },

      {
        test: /\.s?css$/,
        loader: 'style!css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap!sass?sourceMap',
      }
    ]
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' })
  ]
};

if (process.env.NODE_ENV !== 'production') {
  config.devtool = 'inline-source-map';

  config.entry.unshift(
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server'
  );

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );

  config.devServer = {
    hot: true,
    host: '0.0.0.0'
  };
} else {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: 'production'
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}

module.exports = config;
/* eslint-enable */
