
var fs = require('fs')
var path = require('path')
var mod={
	name:'',
	time: (new Date).getTime()
}
console.log("hola");

function returnFormat(event,value){
	var my={};
	my[event]=value;
	console.log(JSON.stringify(my));
}

function update(event, filename){
	var result=path.normalize('F:/'+filename);
 	if(result!==mod.name){
 		mod.time=(new Date).getTime();
 		mod.name=result;
 		if(event=="rename")
	 		if(fs.existsSync(result))
	 			returnFormat('added',result)
	 		else
	 			returnFormat('deleted',result)
 		
 	}else{
	 	if((new Date).getTime()-mod.time>=500){
	 		mod.time=(new Date).getTime();
	 		mod.name=result;
	 		if(event=="rename")
	 		if(fs.existsSync(result))
	 			returnFormat('added',result)
	 		else
	 			returnFormat('deleted',result)
	 		
	 	}else
	 		mod.time=(new Date).getTime();
	}	
 }

fs.watch('F:/',{recursive:true}, function (event, filename) {
 	
 	update(event, filename)

 	return;
	
});
return;
var fs=require('fs-extra');
var compressor = require('node-minify');

// Using UglifyJS 
compressor.minify({
  compressor: 'uglifyjs',
  input: './public/Raptor/js/raptor-core.js',
  output: './bar.js',
  callback: function (err, min) {}
});