'use strict';
const fs = require('fs')
const path = require('path')

/**
 * Raptor.js - v2
 * 
 * @Route("/raptor/extjs/designer")
 */
class ExtjsDesigner extends R.Controller {

	configure() {

	}

    /**
     * @Route("")
     */
	indexAction(req, res, next) {

		res.render("extjs-designer:extjs.html.ejs");
	}

	/**
     * @Route("/save")
     */
	saveAction(req, res, next) {
		var filename = "";
		var conf = JSON.parse(req.body.conf);
		var ui = JSON.parse(req.body.ui);
		var name = conf.base.split('.')
		name = name[name.length - 1];
		var filenameSrc = ''
		var filenameStore = ''
		if (req.body.isNew) {
			filename = path.join(path.dirname(req.body.app), "ui", ui.itemId + ".meta.json");
			if (!fs.existsSync(path.join(path.dirname(req.body.app), "ui")))
				fs.mkdirSync(path.join(path.dirname(req.body.app), "ui"))
			filenameSrc = path.join(path.dirname(req.body.app), "app", "view", ui.itemId + ".js");
			filenameStore = path.join(path.dirname(req.body.app), "app", "store");
		} else {
			filename = path.join(req.body.app);
			filenameSrc = path.join(path.dirname(req.body.app), "..", "app", "view", ui.itemId + ".js");
			filenameStore = path.join(path.dirname(req.body.app), "..", "app", "store");
			if (!fs.existsSync(path.dirname(filename)))
				fs.mkdirSync(path.dirname(filename))
		}
		var storeData=JSON.parse(req.body.store?req.body.store:'[]')
		fs.writeFileSync(filename, JSON.stringify({
			ui: JSON.parse(req.body.ui),
			tree: JSON.parse(req.body.tree),
			store: storeData,
			idgen: req.body.idgen,
			conf: JSON.parse(req.body.conf)
		}, null, 2));

		ui.extend = conf.base;
		res.render('extjs-designer:class.js.ejs', {
			name: conf.prefixName + ".view." + ui.itemId,
			config: JSON.stringify(ui, null, 2)
		}, function (err, str) {

			fs.writeFileSync(filenameSrc, str);
		})
		var stores = []
		if (req.body.store) {
			var store = storeData;
			for (let index = 0; index < store.length; index++) {
				var config = {

					fields: ['name'],
					data: []
				}
				if (store[index].type == 'Ext.data.Store') {
					config.extend = 'Ext.data.Store'
				}
				if (store[index].type == 'Ext.data.TreeStore') {
					config.extend = 'Ext.data.TreeStore'
					config.root = {
						text: "Global",
						expandable: false
					}
				}
				this.createStore(res, conf.prefixName, store[index].name, config, filenameStore)
				
			}
		}

		fs
			.readdirSync(filenameStore)
			.filter(function (file) {
				return (file.indexOf('.') !== 0)
			})
			.forEach(function (file) {
				stores.push(path.basename(file,'.js'))
			 })

		var vm = require('vm');
		var sandbox = this.getSandBox()
		try {
			vm.runInNewContext(fs.readFileSync(path.join(filenameStore, '..', '..', 'app.js')).toString(), sandbox)
			sandbox.Ext.ui.stores = stores;
			this.createApp(res, sandbox.Ext.ui, path.join(filenameStore, '..', '..'))
		} catch (error) {
			//console.log(error.message)
		}

		res.json({
			src: "La interfaz <b>" + path.basename(filenameSrc) + "</b> fue generada en el directorio <b>app/view</b>, el archivo <b>" + path.basename(filename) + "</b> de edición de la ui fue creado en el directorio <b>app/ui</b>"
		})
	}

	createStore(res, prefix, name, config, filenameSrc) {
		res.render('extjs-designer:class.js.ejs', {
			name: prefix + ".store." + name,
			config: JSON.stringify(config, null, 2)
		}, function (err, str) {

			fs.writeFileSync(path.join(filenameSrc, name + '.js'), str);
		})
	}

	createApp(res, config, filenameSrc) {
		res.render('extjs-designer:app.js.ejs', {
			config: JSON.stringify(config, null, 2)
		}, function (err, str) {

			fs.writeFileSync(path.join(filenameSrc, 'app.js'), str);
		})
	}

	getSandBox() {
		return {
			Ext: {
				define: function (name, object) {
					/**object.callParent=function(){}
					if(object.initComponent){
						object.initComponent()
					}
					if (object.extend == 'Ext.container.Viewport'){
						this.valid = true
						this.ui=object.items;
					}*/

				},
				application: function (obj) {
					this.valid = true
					this.ui = obj;
				}
			},
			Raptor: {
				getTag: function () { },
				public: function () { }
			}
		};
	}

	/**
     * @Route("/filesystem")
     */
	fileAction(req, res, next, ProjectManager) {
		if (req.query.node == 'root') {
			var hijos = []
			for (const key in ProjectManager.components) {
				
				hijos.push({
					name: ProjectManager.components[key].name,
					id: path.join(ProjectManager.components[key].absolutePath, 'Resources'),
					expanded: false
				})
			}
			res.json([{
				name: 'src',
				id: 'src',
				expanded: true,
				children: hijos
			}]);
		} else {

			var files = []
			fs.readdirSync(req.query.node)
				.filter(function (file) {
					return (file.indexOf('.') !== 0)
				})
				.forEach(function (file) {
					var isFile = !fs.lstatSync(path.join(req.query.node, file)).isDirectory()
					var obj = {
						name: file,
						id: path.join(req.query.node, file),
						leaf: isFile,
						expanded: false
					}
					var vm = require('vm');

					var sandbox = {
						Ext: {
							define: function (name, object) {
								/**object.callParent=function(){}
								if(object.initComponent){
									object.initComponent()
								}
								if (object.extend == 'Ext.container.Viewport'){
									this.valid = true
									this.ui=object.items;
								}*/

							},
							application: function (obj) {
								this.valid = true
								this.ui = obj;
							}
						},
						Raptor: {
							getTag: function () { },
							public: function () { }
						}
					};

					if (isFile && path.extname(file) == '.js') {
						try {
							vm.runInNewContext(fs.readFileSync(path.join(req.query.node, file)), sandbox)
						} catch (error) {
							//console.log(error.message)
						}
						if (sandbox.Ext.valid) {
							if (fs.existsSync(path.join(req.query.node, "ui", "meta.ui.json"))) {
								//obj.meta=JSON.parse(fs.readFileSync(path.join(req.query.node, "meta.ui.json")).toString());
							}
							obj.isView = true;
							obj.confUI = sandbox.Ext.ui;
							obj.icon = "/public/" + R.bundles["extjs-designer"].vendor + "/extjs-designer/resources/img/class-m.png"
						}
					}
					if (isFile && path.extname(file) == '.json') {
						var meta = {}
						try {
							meta = JSON.parse(fs.readFileSync(path.join(req.query.node, file)));
						} catch (error) {
							//console.log(error.message)
						}

						if (meta && meta.ui && meta.tree) {

							obj.meta = meta;

							obj.isView = true;
							obj.icon = "/public/" + R.bundles["extjs-designer"].vendor + "/extjs-designer/resources/img/class-m.png"
						}
					}
					files.push(obj)
				})
			res.json(files);
		}

	}
}

module.exports = ExtjsDesigner;