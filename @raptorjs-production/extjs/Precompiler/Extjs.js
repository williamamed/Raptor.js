
var fs = require('fs');
var path = require('path');
var compressor = require('node-minify');
/**
* Preminifica los fuentes de una arquitectura
* MVC de una aplicacion Extjs 4.2.1
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

					if(file=='compileApp'){
						
						compressor.minify({
						  compressor: compress==true?'uglifyjs':'no-compress',

						  input: [
							  path.join(directory,'app','model')+'/*.js',
							  path.join(directory,'app','store')+'/*.js',
							  path.join(directory,'app','view')+'/*.js',
							  path.join(directory,'app','controller')+'/*.js'
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
		
    },
	/*
	*
	* Busca ficheros .js y retorna el contenido de estos
	*
	* @deprecated Sustituido por compressor minify 
	*/
    get: function(directory) {
    layer = '';
    var files = fs.readdirSync(directory);
    fs.readdirSync(directory)
		.forEach(function(file){
			if (!fs.statSync(path.join(directory,file)).isDirectory()){
				if (path.extname(path.join(directory,file)) == '.js') {
					layer += fs.readFileSync(path.join(directory,file));
				}
			}
			
	})
    return layer;
}

}
