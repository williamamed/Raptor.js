var fs=require('fs')
var tech={}
fs.readdirSync(__dirname)
		.filter(function (file) {
			return (file.indexOf('.') !== 0) && (file !== 'index.js')
		})
		.forEach(function (file) {
			tech[file]=require("./"+file)
        })
module.exports=tech;