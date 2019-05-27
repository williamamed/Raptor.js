'use strict';
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');

/**
* @Route("/raptor/component/create.v2")
*/
class CreateComponent extends R.Controller {

	configure() {

	}

    /** 
	 * @Route("")
	 */
	indexAction(req, res, next) {
		res.render('RaptorNode:ng/create.node.ejs')
	}

	/**
	 * @Route("/list")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	listAction(req, res, next) {
		
		var vendors = {};
		for (var i in this.R.bundles) {
			if (!vendors[this.R.bundles[i].vendor]) {
				vendors[this.R.bundles[i].vendor] = {};
				vendors[this.R.bundles[i].vendor][this.R.bundles[i].name] = this.R.bundles[i].name;
			}
			else {
				vendors[this.R.bundles[i].vendor][this.R.bundles[i].name] = this.R.bundles[i].name;
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
				mchildren['text'] = vendors[i][j];
				//children['iconCls'] = 'icon-bundle';
				mchildren['expandable'] = false;
				mchildren['vendor'] = false;
				mchildren['namespace'] = vendors[i][j];
				mchildren['type'] = "comp";
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
	createNodeAction(req, res, next) {
		
		var vendor = req.body.vendor;
		var nodeName = req.body.bundle;
		nodeName += 'Node';
		var self = this;
		var messages = [];
		if (!this.R.bundles[nodeName]) {
			R.lockNodemon()
			if (!CreateComponent.createNodeDirectory(vendor, nodeName, messages)) {
				res.show("Lo sentimos no se pudo crear el directorio", R.Controller.ERROR)
				R.unlockNodemon()
				return;
			}
			CreateComponent.createFiles(nodeName, vendor, messages);
			R.unlockNodemon()
			R.registerComponent(nodeName, vendor)
			R.prepareComponent(nodeName)
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
	static createNodeDirectory(vendor, nodeName, messages) {
		var src = path.join($injector('R').basePath, 'src');
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
	static createFiles(nodeName, vendor, messages) {

		var index = $injector('R').template('RaptorNode:GenerateNode/node-template/index.js.ejs', {
			classname: nodeName
		});

		var es6 = $injector('R').template('RaptorNode:GenerateNode/node-template/ControllerES6.js.ejs', {
			classname: nodeName.replace('Node', '')
		});

		
		var src = path.join(R.basePath, 'src');
		fs.writeFileSync(path.join(src, vendor, nodeName, 'index.js'), index);
		fs.writeFileSync(path.join(src, vendor, nodeName, 'Controllers/DefaultController.js'), es6);
		
		//fs.writeFileSync(path.join(src,vendor,nodeName,'Controllers/DefaultControllerCJ.js'), commonJS);
		var data = {
			state: true,
			name: nodeName,
			version: '1.0.0'
		}
		fs.writeFileSync(path.join(src, vendor, nodeName, 'manifest.json'), JSON.stringify(data, null, 2))

		messages.push("Archivo src/" + vendor + '/' + nodeName + '/index.js' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/Controllers/DefaultControllerES6.js' + ' creado');
		messages.push("Archivo src/" + vendor + '/' + nodeName + '/Controllers/DefaultControllerCJ.js' + ' creado');
		messages.push("");
	}

	/**
	 * @Route("/delete")
	 * @param {*} req 
	 * @param {*} res 
	 * @param {*} next 
	 */
	deleteNodeAction(req, res, next) {


		if (req.body.nodecomponent == 'RaptorNode' || req.body.nodecomponent == 'CoreNode') {
			res.show('Es una pena !!<br>El componente '+req.body.nodecomponent+' no puede ser eliminado, es componente base del framework.', R.Controller.ERROR);
			return;
		}

		if (req.body.nodecomponent && this.R.bundles[req.body.nodecomponent]) {
			var self = this;

			var dir = fs.readdirSync(path.join(self.R.basePath, 'src', self.R.bundles[req.body.nodecomponent].vendor));
			var ruta=''
			if (dir.length > 1){
				ruta=this.R.basePath + '/src/' + this.R.bundles[req.body.nodecomponent].path;
				
			}else{
				ruta=this.R.basePath + '/src/' + this.R.bundles[req.body.nodecomponent].vendor;
			}
			R.lockNodemon()
			fse.remove(ruta, function (err) {
				R.unlockNodemon()
				if (err) {
					console.log(err);
					return res.show('Ocurrió un error eliminando el componente, intentelo nuevamente.' + err.message, R.Controller.ERROR);
				}

				delete R.bundles[req.body.nodecomponent];
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
	genModelNodeAction(req, res, next) {
		/**process.on('SIGUSR2', function () {
			console.log('quiere apagar')
		});
		console.log('registro')*/
		var es6 = $injector('R').template('RaptorNode:GenerateNode/node-template/ControllerES6.js.ejs', {
			classname: req.body.controllername
		});

		var src = path.join(this.R.basePath, 'src');
		R.lockNodemon()
		fs.writeFileSync(path.join(src, this.R.bundles[req.body.component].vendor, req.body.component, 'Controllers/' + req.body.controllername + '.js'), es6);
		R.unlockNodemon()
		res.show('El controlador fue creado correctamente.')
	}
}

module.exports = CreateComponent;