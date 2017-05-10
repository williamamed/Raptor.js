
var fs=require('fs-extra');
var compressor = require('node-minify');

// Using UglifyJS 
compressor.minify({
  compressor: 'uglifyjs',
  input: './public/Raptor/js/raptor-core.js',
  output: './bar.js',
  callback: function (err, min) {}
});