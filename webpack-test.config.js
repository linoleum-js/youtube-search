var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: __dirname,
  entry: './spec/index.js',
  output: {
    path: path.join(__dirname, 'spec'),
    filename: 'spec.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'text' }
    ]
  }
};
