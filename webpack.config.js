var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: __dirname,
	entry: './src/script.js',
	output: {
		path: __dirname,
		filename: 'script.js'
	},

	module: {
		loaders: [
      { test: /\.js$/, loader: 'babel' },
			{ test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'text' }
		]
	}
};
