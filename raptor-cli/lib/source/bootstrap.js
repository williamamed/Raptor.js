/**
 * Entrada de la aplicacion Raptor.js
 * Esta clase implementa el arranque y es
 * atajo para invocar el core.
 * 
 * Implementado desde la version 2.1.0
 * Raptor.js v2
 */
class bootstrap{

	/**
	 * Devuelve la clase principal que representa al core
	 * de Raptor.js ---> R
	 */
	static getClass(){
		return require('@raptorjs/core/Source/Raptor');
	}

	/**
	 * Inicia la rutina de arranque del framework
	 */
	static main() {
		return require('@raptorjs/core/Source/app');
	}

}
module.exports=bootstrap;