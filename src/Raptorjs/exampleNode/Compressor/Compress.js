"use strict"

/**
 * Raptor.js - Compressor
 * Generado automaticamente
 * 
 */
class Compress extends R.Compressor{
	/**
	 * Sera ejecutado cuando se invoque el publicador de recursos
	 * @param {Raptor} R 
	 * @param {Compressor} compressor 
	 */
	run(R,compressor){
		// Comprimir archivos JS
        /**
		this.compressJS({
			compress: true,
			input:[
				__dirname+"/Resources/js/mi.js",
				R.basePath+"/public/bootstrap/bootstrap.min.js"
			],
			output: __dirname+"/Resources/all.js",
        })
		*/
		/**
		 * Marker, cuando encuentre un archivo angularjsMarker dentro 
		 * del directorio Resources unificara todos los archivos js y
		 * creara un archivo all.js
		 */
		/**
		Compress.marker(__dirname+"/../Resources",{
			marker:"angularjsMarker",
			input:["./*.js"],
			output:"/out/all.js"
		})
		*/
	}

}

module.exports=Compress;