var webpack = require('webpack');
var path = require('path');

module.exports = {
	context: __dirname,
	entry: './src/index.js',
	output: {
		path: path.join(__dirname, 'chrome-extension'),
		filename: 'script.js'
	},

	module: {
		loaders: [
      { test: /\.js$/, loader: 'babel' },
			{ test: /\.css$/, loader: 'style!css' },
      { test: /\.html$/, loader: 'text' },
			{ test: /\.png$/, loader: 'url-loader' }
		]
	}
};
