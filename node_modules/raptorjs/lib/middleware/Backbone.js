
var fs = require('fs');
var path = require('path');
var compressor = require('node-minify');
/**
* Preminifica los fuentes de una arquitectura
* MVC de una aplicacion Backbone
*
* @authors Jorge Carmenate, William Amed
*/
module.exports={
	/*
	*	Para las vistas que son de ext.js obtiene todos los ficheros
	*   de todos los directorios y escribe el contenido en un fichero
	*   llamado all-classes.js de esa mismo directorio raiz.
	*/
    preCompileApp: function (directory,compress) {
		var self=this;
		fs.readdirSync(directory)
			.forEach(function(file) {
			   if (fs.statSync(path.join(directory,file)).isDirectory()) {
					self.preCompileApp(path.join(directory,file),compress);
			   }else {

					if(file=='backboneApp'){
						var cond=false;
						compressor.minify({
						  compressor: compress==true?'uglifyjs':'no-compress',
						  sync: true,
						  input: [
							  path.join(directory,'app','model')+'/*.js',
							  path.join(directory,'app','view')+'/*.js',
							  path.join(directory,'app')+'/*.js'
						  ],
						  output: path.join(directory,'all-classes.js'),
						  callback: function (err, min) {
						  	
						  	
						  	if(err)
						  		console.log(err)
						  	else
						  		fs.writeFileSync(path.join(directory,'all-classes.js'), min + fs.readFileSync(path.join(directory,'app.js')));
						  	
						  	
						  }
						});
						

					}
			   }
			   
			})
			
		
    }
	
}
