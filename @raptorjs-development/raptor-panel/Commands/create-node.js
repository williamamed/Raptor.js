var format= require('raptor-cli/lib/format'),
	fs=require('fs'),
	path=require('path')

module.exports={
	command:'comp, --create-component',
	description: 'Crea un nuevo componente',
	placeholder:'createNode',
	action:function(R,value,arg,program){
	    
		try {
			var R = require(path.join(process.cwd(), 'bootstrap')).getClass()
			
			R.addExternalComponents([path.join(__dirname,'..','..','..')])
			
            R.main(process.cwd());
            R.readConfig();
		} catch (e) {
			console.log(format.get("Error:", format.RED));
			console.log("Este comando es válido solo en en la raíz de un proyecto Raptor.js, si es así es posible que el proyecto no tenga todas dependencias instaladas o presente algún error en la carga de módulos.")
			return;
        }
		
		var readline = require('readline'),
	      rl = readline.createInterface(process.stdin, process.stdout),
	      self=this,
	      index=0,
	      cmp=''

	      
	      console.log(format.getFormated('¿Cúal es el nombre del componente?','blue'));
	      rl.setPrompt('Raptor.js> ');
	      rl.prompt();
	      rl.on('line', function(line) {

	      	switch(index){
	      		case 0:{
	      			var name=line.trim();
			      	var exp=/^[A-Za-z0-9@\-]+$/;
			      	
			      	if(exp.test(name)){
						index++;
						/**if(name.substr(-4)=='Node')
							cmp=name;
						else
							cmp=name+"Node";*/
						cmp=name;
			      		console.log(format.getFormated('¿Cúal es el nombre del agrupador(vendor) que desea utilizar en el componente?','blue'));
			      		rl.prompt();
			      	}else{
			      		console.log(format.getFormated('La cadena contiene caracteres no permitidos, entre de nuevo el nombre','red'));
			      		rl.prompt();
			      	}
	      			break;
	      		}
	      		case 1:{
	      			var name=line.trim();
			      	var exp=/^[A-Za-z0-9@\-]+$/;
			      	
			      	if(exp.test(name)){
			      		index++;
			      		self.onCreate(cmp,name,R)
			      		rl.close()
			      	}else{
			      		console.log(format.getFormated('La cadena contiene caracteres no permitidos, entre de nuevo el nombre','red'));
			      		rl.prompt();
			      	}
	      			break;
	      		}
	      	}

	      	
	      })
	},
	onCreate:function(name,vendor,R){
	    var controller=require(__dirname+"/../Controllers/CreateCompV2")
	    var msg=[]
		var vendorDir=path.join(R.basePath,'src',vendor)
		if(!fs.existsSync(vendorDir))
			fs.mkdirSync(vendorDir);
		console.log(vendor,name)
		if(fs.existsSync(vendorDir))
		    if(controller.createNodeDirectory(vendor,name,msg)){
		        controller.createFiles(name,vendor,msg)
		        for (var i = 0; i < msg.length; i++) {
		            console.log(format.getFormated(msg[i],'green'));
		        }
		    }else
		        console.log(format.getFormated('No se pudo crear el componente con el nombre especificado, ya existe uno con el mismo nombre','red'));
		
		if(fs.readdirSync(vendorDir).length==0){
			fs.rmdirSync(vendorDir);
			console.log(format.getFormated('Agrupador '+vendor+' eliminado','red'));
		}

		
		
	}
}