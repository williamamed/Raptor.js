'use strict';
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

/**
* @Route("/raptor/component/create.v2")
* @Controller
*/
class CreateComponent {

	configure() {

	}

    /** 
	 * @Route("")
	 */
	indexAction(req, res, next) {
		res.render('raptor-panel:ng/create.node.ejs')
	}

	/**
	 * @Route("/list")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	listAction(req, res, next, ProjectManager) {
		
		var vendors = {};
		for (var i in ProjectManager.components) {
			let comp=ProjectManager.components[i];
			if (!vendors[comp.vendor]) {
				vendors[comp.vendor] = {};
				vendors[comp.vendor][comp.name] = comp;
			}
			else {
				vendors[comp.vendor][comp.name] = comp;
			}
		}
		var tree = [];
		for (var i in vendors) {
			var obj = vendors[i];
			var item = {};
			item['text'] = i;
			item['children'] = [];
			item['expanded'] = true;
			item['vendor'] = true;
			item['state'] = {
				opened: true
			};
			item['type'] = "vendor";
			//item['iconCls'] = 'icon-vendor';
			for (var j in obj) {
				var mchildren = {};
				mchildren['text'] = !vendors[i][j].external?vendors[i][j].name:vendors[i][j].name+" <span style='font-size:10px;color:yellowgreen'>(external)</span>";
				//children['iconCls'] = 'icon-bundle';
				mchildren['expandable'] = false;
				mchildren['vendor'] = false;
				mchildren['namespace'] = vendors[i][j].name;
				mchildren['type'] = "comp";
				mchildren['external'] = vendors[i][j].external;
				item['children'].push(mchildren);
			}
			tree.push(item);
		}
		res.json(tree);

	}

    /**
	 * @Route("/create")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	createNodeAction(req, res, next, ProjectManager) {
		
		var vendor = req.body.vendor;
		var nodeName = req.body.bundle;
		
		var self = this;
		var messages = [];
		if (!ProjectManager.components[nodeName]) {
			//R.lockNodemon()
			if (!CreateComponent.createNodeDirectory(vendor, nodeName, messages, R.basePath)) {
				res.show("Lo sentimos no se pudo crear el directorio", R.Controller.ERROR)
				//R.unlockNodemon()
				return;
			}
			CreateComponent.createFiles(nodeName, vendor, messages, R.basePath);
			//R.unlockNodemon()
			//R.registerComponent(nodeName, vendor)
			ProjectManager.components[nodeName]={
				name: nodeName,
				vendor: vendor,
				path: path.join(vendor,nodeName),
				absolutePath: path.join(this.R.basePath,vendor,nodeName)
			}
			//R.prepareComponent(nodeName)
		} else {
			res.show("El módulo especificado ya existe.", R.Controller.ERROR);
			return;
		}
		
		res.show('El módulo fue generado correctamente.', {
			routine: messages.map(function (value) {
				return '<span style="color:white">' + value + '</span>'
			}),
			name: nodeName,
			nameVendor: vendor
		});


	}


	/**
	*
	*
	*/
	static createNodeDirectory(vendor, nodeName, messages, base) {
		var src = path.join(base, 'src');
		if (!fs.existsSync(path.join(src, vendor)))
			fs.mkdirSync(path.join(src, vendor));
		
		if (fs.existsSync(path.join(src, vendor, nodeName)))
			return false;
		fs.mkdirSync(path.join(src, vendor, nodeName));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'Controllers'));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'Resources'));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'Views'));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'Models'));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'i18n'));
		fs.mkdirSync(path.join(src, vendor, nodeName, 'Commands'));

		messages.push("Directorio src/" + vendor + '/' + nodeName + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/Controllers' + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/Resources' + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/Views' + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/Models' + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/i18n' + ' creado');
		messages.push("Directorio src/" + vendor + '/' + nodeName + '/Commands' + ' creado');
		return true;
	}

	/**
	*
	*
	*/
	static createFiles(nodeName, vendor, messages, base) {

		var index = $injector('R').template(path.join(__dirname,'..','Views','GenerateNode/node-template/index.js.ejs'), {
			classname: nodeName
		});

		var es6 = $injector('R').template(path.join(__dirname,'..','Views','GenerateNode/node-template/ControllerES6.js.ejs'), {
			classname: nodeName.replace('Node', '')
		});

		
		var src = path.join(base, 'src');
		fs.writeFileSync(path.join(src, vendor, nodeName, 'index.js'), index);
		fs.writeFileSync(path.join(src, vendor, nodeName, 'Controllers/DefaultController.js'), es6);
		
		//fs.writeFileSync(path.join(src,vendor,nodeName,'Controllers/DefaultControllerCJ.js'), commonJS);
		var data = {
			state: true,
			name: nodeName,
			version: '1.0.0'
		}
		var pkg = {
			name: nodeName,
			version: '1.0.0',
			description: "",
			main: "index.js",
			scripts: {
				"test": "echo \"Error: no test specified\" && exit 1"
			},
			author: "",
			license: "MIT"
		}
		var lang={
			"textoprueba":{
				"es":"Texto de inicio",
				"en":"Initial text"
			}
		}
		fs.writeFileSync(path.join(src, vendor, nodeName, 'manifest.json'), JSON.stringify(data, null, 2))
		fs.writeFileSync(path.join(src, vendor, nodeName, 'package.json'), JSON.stringify(pkg, null, 2))
		fs.writeFileSync(path.join(src, vendor, nodeName, 'i18n' ,'language.json'), JSON.stringify(lang, null, 2))
		
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/manifest.json' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/package.json' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/index.js' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/Controllers/DefaultController.js' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/i18n/language.json' + ' creado');
		//messages.push("Archivo src/" + vendor + '/' + nodeName + '/Controllers/DefaultControllerCJ.js' + ' creado');
		messages.push("");
	}

	/**
	 * @Route("/delete")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	deleteNodeAction(req, res, next, ProjectManager) {


		if (ProjectManager.components[req.body.nodecomponent] && ProjectManager.components[req.body.nodecomponent].vendor=='@raptorjs') {
			res.show('Es una pena !! El componente '+req.body.nodecomponent+' no puede ser eliminado, es componente base del framework.', R.Controller.ERROR);
			return;
		}

		if (req.body.nodecomponent && ProjectManager.components[req.body.nodecomponent]) {
			var self = this;

			var dir = fs.readdirSync(path.join(self.R.basePath, 'src', ProjectManager.components[req.body.nodecomponent].vendor));
			var ruta=''
			if (dir.length > 1){
				ruta=this.R.basePath + '/src/' + ProjectManager.components[req.body.nodecomponent].path;
				
			}else{
				ruta=this.R.basePath + '/src/' + ProjectManager.components[req.body.nodecomponent].vendor;
			}
			//R.lockNodemon()
			fse.remove(ruta, function (err) {
				//R.unlockNodemon()
				if (err) {
					console.log(err);
					return res.show('Ocurrió un error eliminando el componente, intentelo nuevamente.' + err.message, R.Controller.ERROR);
				}

				delete ProjectManager.components[req.body.nodecomponent];
				res.show('El módulo fue eliminado correctamente.');

			});

		} else
			res.show('No se encontro el componente especificado.', R.Controller.ERROR);

	}

	/**
	 * @Route("/controller")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	genControllerAction(req, res, next, ProjectManager) {
		
		var composed=req.body.controllername.split('/');
		var controllerName=composed.pop();
		var prefix=composed.pop();
		if(!prefix)
			prefix=''
		var es6 = $injector('R').template('raptor-panel:GenerateNode/node-template/ControllerES6.js.ejs', {
			classname: controllerName
		});

		var src = path.join(this.R.basePath, 'src');
		//R.lockNodemon()
		
		fse.ensureDirSync(path.join(ProjectManager.components[req.body.component].absolutePath, 'Controllers',prefix))
		fs.writeFileSync(path.join(ProjectManager.components[req.body.component].absolutePath, 'Controllers' ,prefix, controllerName + '.js'), es6);
		//R.unlockNodemon()
		res.show('El controlador fue creado correctamente.')
	}
}

module.exports = CreateComponent;