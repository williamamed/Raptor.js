/*
* Raptor.js
* Configuracion del framework
* 
*
*
*/

module.exports={
	mode:'development',
   /**
	* Database to use
	*
	*/
	database:{
		state: 'on',
		name:'goatjs',
		user:'root',
		password:'root',
		options:{
			host:'127.0.0.1'
		},
		api:true
	},
   /**
	* Puerto por defecto para Raptor.js
	*/
	port:4440,
   /**
	* Llave secreta de la session
	*/
	secret:'raptorjssecurity',
	/*
	* 
	* 
	* Configuracion de socket.io
	*
	*/
	socketio:{
		active: false
	}

	
}