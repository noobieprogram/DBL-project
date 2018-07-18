var path = require('path');
var paths = require('./paths');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, paths.scripts.src),
  output: {
    path: path.resolve(__dirname, paths.scripts.build),
    filename: paths.scripts.buildName
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
};
