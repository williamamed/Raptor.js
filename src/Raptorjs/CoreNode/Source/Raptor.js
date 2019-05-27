'use strict'

var errorHandler;

var express = require('express'),
	lodash = require('lodash'),
	passportConfig = null,
	options = null,
	fs = require('fs'),
	path = require('path'),
	ViewFunctions = require('./ViewFunctions'),
	semver = require("semver")


var fse = require('fs-extra')
var format = require('./util/format')
var deprecate = require('depd')('Raptor.js 2')

Error.prototype.is = function (code) {
	return this.code == code
}

var __i18nDefinition = {};

//Supports old promise
var Promise = require('sequelize').Promise;
Promise.defer = function () {
	var p = new Promise(function () { })
	return {
		promise: p,
		resolve: function (value) {
			p._resolveCallback(value)
		},
		reject: function (v) {
			p._rejectCallback(v, false)
		}
	}
}

/**
 * Modulos que se cargaran por demanda cuando se accedan a ellos desde el objeto R
 */
const defered = {

	extjs: function () {
		return require('./middleware/Extjs')
	},
	backbone: function () {
		return require('./middleware/Backbone')
	},
	i18nClass: function () {
		return require('./util/i18n');
	},
	Controller: function () {
		return require('./Controller')
	},
	ejs: function () {
		return require('ejs')
	},
	Compressor: function () {
		var comp = require('./Compressor')

		comp.markers = []
		comp.markers.add = function (marker) {

			comp.markers.push(marker)

			return this
		}

		comp.markers.execute = function (relativePath) {

			comp.markers.forEach(function (func) {
				func(relativePath)
			})
		}

		return comp;
	}
}

/**
 * Raptor.js v2.0.0
 * MIT License
 *
 * Copyright (c) 2017 williamamed
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 *furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * 
 * @author William Amed <watamayo90@gmail.com>
 */
module.exports = {

	basePath: './',
	status: 0,
	RUNNING: 1,
	errors: {
		register: function (name) {
			this.__container[name] = true;
		},
		remove: function (name) {
			if (this.__container[name])
				delete this.__container[name]
		},
		exist: function (name) {
			if (this.__container[name])
				return true;
			else
				return false;
		},
		__container: {}

	},

	STOPPED: 0,
	errorHandler: errorHandler,
	ViewFunctions: ViewFunctions,

	bundles: {},
	Promise: Promise,
	/**
	 * @Doc("Los hooks están en desuso desde esta serie 2",
	 * author="William Amed",
	 * type="property",
	 * deprecated=true)
	 * @deprecated Se removera desde la version 2.0.0
	 */
	hooks: {
		middleware: function (point) {
			deprecate("function R.hooks.middleware")
			if (point == 'before') {
				if (!this._beforeMiddleware)
					this._beforeMiddleware = Promise.defer()
				return this._beforeMiddleware;
			}
			if (point == 'after') {
				if (!this._afterMiddleware)
					this._afterMiddleware = Promise.defer()
				return this._afterMiddleware;
			}
		},
		config: function (point) {
			deprecate("function R.hooks.config")
			if (point == 'before') {
				if (!this._beforeConfig)
					this._beforeConfig = Promise.defer()
				return this._beforeConfig;
			}
			if (point == 'after') {
				if (!this._afterConfig)
					this._afterConfig = Promise.defer()
				return this._afterConfig;
			}
		}
	},
	/**
	 * Lee la configuracion de los modulos de src
	 */
	readConfig: function () {

		this.options = options;

		if (this.options.socketio && this.options.socketio.active)
			this._io = require('socket.io')
		else
			this._io = null;
		this.lookModules();
		//this.prepareNodeComponents();
		//console.log(this.bundles)
	},

	/**
	 * Lee la configuracion de options
	 */
	readOptions: function () {
		options = require(path.join(this.basePath, 'config/options.json'));
		this.options = options;
	},

	/**
	 * Ejecuta el callback pasado por parametro en
	 * en el scope que se le pasa como segundo argumento
	 * @deprecated a remover en versiones superiores
	 */
	proxy: function (callback, scope) {
		deprecate("function R.proxy")
		return function (req, res) {
			var resp = callback.apply(scope, arguments);
			if (typeof resp == 'string')
				res.end(resp);

			if (typeof resp !== 'undefined')
				res.end();
		}
	},

	/**
	* Puntos calientes de insercionde contenido
	*
	*/
	viewHotSpot: {},

	/**
	* Establece un contenido para un nombre de HotSpot
	* @param string name Nombre del HotSpot
	* @param string content Contenido a inyectar en el HotSpot
	* @deprecated a remover en versiones superiores, usar $injector
	*/
	setViewPlugin: function (name, content) {
		deprecate("function R.setViewPlugin")
		if (this.viewHotSpot[name]) {
			this.viewHotSpot[name].push(content);
		} else {
			this.viewHotSpot[name] = new Array(content);
		}
	},

	/**
	 * @deprecated a remover en versiones superiores
	 */
	getViewPlugin: function (name) {
		deprecate("function R.getViewPlugin")
		if (this.viewHotSpot[name]) {
			return this.viewHotSpot[name];
		} else {
			return [];
		}
	},
	/**
	 * @deprecated a remover en versiones superiores
	 */
	cleanViewPlugin: function (name) {
		deprecate("function R.cleanViewPlugin")
		if (this.viewHotSpot[name])
			this.viewHotSpot[name] = [];
	},
	/**
	 * @deprecated a remover en versiones superiores
	 */
	cleanAllViewPlugin: function () {
		deprecate("function R.cleanAllViewPlugin")
		this.viewHotSpot = [];
	},
	/**	
	 * Entrada principal del framework
	 * @param {string} basepath ruta base absoluta del proyecto Raptor.js
	 */
	main: function (basepath) {

		//Eventos, definir al objeto R como un EventEmitter
		if (!this.eventsDefined) {
			var events = require('events');
			this.__proto__ = events.EventEmitter.prototype;
			events.EventEmitter.call(this);
			this.eventsDefined = true
		}
		/**
		 * Container de dependencias
		 */
		this.container = {}
		var self = this;

		//Creando directorio cache
		if (!fs.existsSync(this.basePath + "/cache"))
			fs.mkdirSync(this.basePath + "/cache")

		if (!fs.existsSync(this.basePath + "/cache/session"))
			fs.mkdirSync(this.basePath + "/cache/session")


		var me = this;
		/**
		 * Definir el objeto R como global
		 * En proximas versiones propuesto para acceder a traves del injector
		 */
		Object.defineProperty(global, 'R', {
			value: me
		});
		/**
		 * Definir el injector de dependencias como global
		 */
		global.$injector = require('./Injector.js')
		/**
		 * Definir dentro del objeto R una referencia hacia el $injector
		 */
		this.$injector = global.$injector;
		//Registro de R en el injector, referencia circular
		$injector('R', this)
		//Registro del SecurityRegistry en el injector
		$injector('SecurityRegistry', this.__getSecurityRegistry())


		this.basePath = basepath;
		//Crear el framework de anotaciones y registrarlo en el injector
		this._configReadAnnotation()
		//passportConfig = require(path.join(this.basePath,'config/passport'));
		//Leer la configuracion general, options.json
		this.readOptions();

		if (this.options.mode == "development") {
			//Solo en modo de desarrollo
			if (fs.existsSync(path.join(basepath, 'cache', 'nodemon.lock')))
				fse.removeSync(path.join(this.basePath, 'cache', 'nodemon.lock'));
		}


		//this.viewFunctions = new ViewFunctions(this);

		//Introspeccion del metodo send
		express.response.__send = express.response.send;
		var client = require('./Client')
		express.response.send = function (body) {

			me.emit('sendresponse', this.req, this)
			me.emit('sendresponse:' + this.req.url, this.req, this)
			var res = this;
			client.getContent(body, me, this, function (content) {
				res.__send(content)
			});
		}

		//Introspeccion del metodo render
		express.response.__render = express.response.render;
		express.response.render = function (a, b, c) {
			var viewFn = new ViewFunctions(R);
			viewFn.__setRequest(this.req);

			b = lodash.extend((b) ? b : {}, { R: viewFn });

			//me.viewFunctions.__setRequest(this.req);
			var div = a.split(':');
			if (div.length == 2 && me.bundles[div[0]]) {

				var view = path.join(me.basePath, 'src', me.bundles[div[0]].path, 'Views', div[1]);

				this.__render(view, b, c);

			} else {
				this.__render(a, b, c);
			}

		}


		express.request.flash = function (name, message) {
			if (!this.session.flash)
				this.session.flash = {};
			if (!message) {
				var msg = this.session.flash[name];
				delete this.session.flash[name];
				return msg;
			} else {
				this.session.flash[name] = message;
			}

		}

		this.app = express();
		$injector('router', this.app)
		$injector('express', this.app)

		$injector('Template404', 'CoreNode:404.ejs')
		$injector('TemplateBasic', 'CoreNode:basic.ejs')
		$injector('TemplateERROR', 'CoreNode:error.ejs')
		$injector('Errors', this.errors)
		$injector('Events', {
			register: function (obj) {
				for (const key in obj) {
					if (typeof obj[key] == 'function') {
						R.on(key, obj[key])
					}
				}
			}
		})
		$injector('DefaultSession', true)
	},
	/**
	 * Configurando express
	 */
	configure: function () {
		var basepath = this.basePath
		var me = this;
		this.errorHandler = require('./middleware/errorHandler')
		var passport = require('passport');

		// Serialize Sessions
		passport.serializeUser(function (user, done) {
			done(null, user);
		});

		//Deserialize Sessions
		passport.deserializeUser(function (user, done) {
			done(null, user);
		});


		this.app.use('/public', express.static(basepath + '/public'));

		this.app.use(this.requestViewPlugin())

		this.readConfig();

		this.app.set('views', basepath + '/public')
		this.app.set('view engine', 'ejs')
		this.app.engines['.html'] = function (path,opt,cb) {
			return cb(null,fs.readFileSync(path))
		}
		this.app.set('port', process.env.PORT || this.options.port || 3003)

		var bodyParser = require('body-parser')
		this.app.use(bodyParser.urlencoded({ extended: false }))

		this.app.use(bodyParser.json())

		var cookieParser = require('cookie-parser')


		this.app.use(cookieParser())
		var session = require('express-session')

		this.emit("session:config", session)
		if ($injector('DefaultSession')) {
			var FileStore = require('session-file-store')(session);

			this.app.use(session({
				secret: this.options.secret,
				store: new FileStore({
					path: this.basePath + "/cache/session/",  //directory where session files will be stored
					useAsync: true,
					reapInterval: 5000,
					maxAge: 10000
				}),
				resave: true,
				saveUninitialized: true,
				cookie: { httpOnly: true }//, secure: true }

			}))
		}

		this.app.use(passport.initialize())
		this.app.use(passport.session())
		var csrf = require('csurf')
		this.app.use(csrf({
			cookie: true,
			key: this.options.cookieName ? this.options.cookieName + '0' : '_csrf_def'
		}))
		this.app.use(function (req, res, next) {
			res.cookie((me.options.cookieName) ? me.options.cookieName + 'A' : '_csrf_red', req.csrfToken());
			next();
		})
		var helmet = require('helmet')

		this.app.use(helmet())
		this.emit("helmet:config", helmet)
		//this.app.use(helmet.csp())
		//this.app.use(helmet.xframe('sameorigin'))
		// Uncomment when using SSL
		//this.app.use(helmet.hsts())
		//this.app.use(helmet.iexss())
		//this.app.use(helmet.cacheControl())

		this.app.use(function (req, res, next) {
			res.setHeader("Pragma", "no-cache");
			res.setHeader("Expires", "0");
			res.locals.csrftoken = req.csrfToken();
			next();
		})


		this.app.use(this.mapOption())
		var language = require('./middleware/language')
		this.app.use(language.prepare(this, (this.options.language) ? this.options.language : {}))

		this.app.use(function (err, req, res, next) {
			if (err.code !== 'EBADCSRFTOKEN') return next(err)

			// handle CSRF token errors here
			res.status(403)

			res.end('Forbiden request by Raptor->' + err.message)
		})
		//var accessLogStream = fs.createWriteStream(this.basePath + '/access.log', {flags: 'a'})
		//this.app.use(express.logger({immediate:true}))

		me.emit('before:middleware')
		//this.runComponentsMiddlewares();
		me.emit('run.middlewares')
		me.emit('after:middleware')

		//this.app.use(this.app.router)
		//express.errorHandler.title='Raptor'

		if (this.options.mode) {
			this.app.set('env', this.options.mode)
		}

		/**
		* Validar el modo produccion para poner un mensaje personalizado
		* 
		*/
		if ('development' === this.app.get('env') && false) {
			this.app.use(this.errorHandler())
		}

		this.emit('before:prepare')
		//Leer los modulos y configuracion
		this.emit('run.prepare')
		this.i18n = this.i18nClass(__i18nDefinition)
		this.emit('after:prepare')

		this.emit('config:error.middleware')
		/**
		 * Agregar middleware gestion de errores de aplicacion
		 * Agregar log de errores
		 */
		this.app.use(function (err, req, res, next) {
			function showError(msg) {
				var accept = req.headers.accept || '';
				if (~accept.indexOf('html')) {
					res.render($injector('TemplateBasic'), { msg: msg })

					// json
				} else if (~accept.indexOf('json')) {
					res.json({ error: msg })

					// plain text
				} else {
					res.setHeader('Content-Type', 'text/plain');
					res.end(msg);
				}
			}
			if (typeof err == "string") {
				res.status(200);
				showError(err.toString())
			} else {
				if (err.code && $injector('Errors').exist(err.code)) {
					R.emit('error:' + err.code, err, req, res, next)
				} else
					next(err)
			}
		})
		/**
		* Validar el modo produccion para poner un mensaje personalizado
		* 
		*/
		if ('development' === this.app.get('env')) {
			this.app.use(this.errorHandler())

		}

		this.app.use(function (req, res, next) {

			var err = new Error('404 Not Found');
			err.status = 404;
			next(err);
		});

		// error handler
		// no stacktraces leaked to user unless in development environment
		this.app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			var accept = req.headers.accept || '';

			// html
			if (~accept.indexOf('html')) {
				if (err.status != 404)
					res.render($injector('TemplateBasic'), { msg: err.toString() })
				else
					res.render($injector('Template404'), { msg: err.message })

				// json
			} else if (~accept.indexOf('json')) {
				res.json({ error: (err.status != 404) ? 'Ups, Ocurrió un Error' : err.toString() })

				// plain text
			} else {
				res.setHeader('Content-Type', 'text/plain');
				res.end((err.status != 404) ? 'Ups, Ocurrió un Error' : err.toString());
			}

		});
	},

	/**
	 * Encendiento el servidor Raptor.js
	 */
	start: function () {
		this.configure()

		var me = this;
		if (this.hasDatabaseConfig()) {
			var obj = {
				logging: function () { }
			};
			obj = lodash.extend(obj, this.options.database.options)
			this.prepareDatabase(this.options.database.name, this.options.database.user, this.options.database.password, obj)

			this.database.sequelize
				.authenticate()
				.then(function (err) {
					console.log('Connection with database has been established successfully.');
					me.emit('database:running')
					me.startServer();
				})
				.catch(function (err) {
					console.log('Unable to connect to the database:', err);
					me.emit('database:failed')
					me.startServer();
				});
		} else {
			this.startServer();
		}
	},

	/*
	* devuelve la direccion relativa a la raiz
	* del proyecto
	*/
	getLocation: function (name) {
		return path.join(this.basePath, 'src', name);
	},

	database: {},

	/**
	 * Prepara la coneccion con la base de datos y lee los
	 * modelos de los modulos de src. Esto todavia no manda
	 * a conectar con la base de datos, solo prepara la coneccion
	 */
	prepareDatabase: function (database, user, pass, options) {

		var Sequelize = require('sequelize')
			, sequelize = new Sequelize(database, user, pass, options)
			, me = this
		if (this.app)
			this.app.set('sequelize', sequelize);
		var associationBuffer = [];

		for (var bundle in this.bundles) {
			var modelPath = path.join(this.basePath, 'src', this.bundles[bundle].path, 'Models');
			if (fs.existsSync(modelPath))
				fs
					.readdirSync(modelPath)
					.filter(function (file) {
						return (file.indexOf('.') !== 0) && (file !== 'index.js')
					})
					.forEach(function (file) {
						var configModel = require(path.join(modelPath, file));

						if (typeof configModel == 'object' && false) {

							var model = sequelize.define(configModel.name, configModel.fields, configModel.methods, configModel.options);

							if (configModel.hooks) {
								for (var hook in configModel.hooks) {
									model.hook(hook, configModel.hooks[hook]);
								}
							}

							if (configModel.associations)
								associationBuffer.push({
									callback: configModel.associations,
									model: model
								})
							me.bundles[bundle].modelsConfig[model.name] = configModel
							if (fs.existsSync(path.join(modelPath, '..', 'Repositories', file))) {
								var repo = require(path.join(modelPath, '..', 'Repositories', file))
								repo.R = me
								model = lodash.extend(model, repo)

							}

							me.bundles[bundle].models[model.name] = model
						}

						if (typeof configModel == 'function') {
							//var model2 = require(path.join(modelPath, file));
							//me.app.configure(model);
							var model = sequelize.import(path.join(modelPath, file))

							if (fs.existsSync(path.join(modelPath, '..', 'Repositories', file))) {
								var repo = require(path.join(modelPath, '..', 'Repositories', file))
								repo.R = me
								model = lodash.extend(model, repo)

							}
							me.bundles[bundle].models[model.name] = model


							$injector(bundle.replace('Node', '') + '_' + model.name, me.bundles[bundle].models[model.name])
						}



					})

		}

		for (var i = 0; i < associationBuffer.length; i++) {
			associationBuffer[i].callback.call(this, associationBuffer[i].model, this)
		};
		//Leer los modelos de los modulos
		// Setup relationships
		const models = sequelize.models;
		//  console.log( Object.keys(models))
		Object.keys(sequelize.models).forEach(function (modelName) {
			if (sequelize.models[modelName].options.classMethods)
				if ("associate" in sequelize.models[modelName].options.classMethods) {

					sequelize.models[modelName].options.classMethods.associate(sequelize.models, me);
				}
			if ("initRepo" in sequelize.models[modelName]) {
				sequelize.models[modelName].initRepo(sequelize.models, me);
			}
		});
		$injector('Sequelize', Sequelize);
		$injector('sequelize', sequelize);
		$injector('queryInterface', sequelize.queryInterface);
		$injector('Op', Sequelize.Op);

		this.database = lodash.extend({
			sequelize: sequelize,
			Sequelize: Sequelize
		}, this.database)

		return true;
	},

	/**
	 * Prepara un modelo adicionado en tiempo de ejecucion
	 */
	prepareComponentModel: function (bundle) {
		var modelPath = path.join(this.basePath, 'src', this.bundles[bundle].path, 'Models');
		var me = this;
		var associationBuffer = [];
		var modelsName = []
		if (fs.existsSync(modelPath)) {
			fs
				.readdirSync(modelPath)
				.filter(function (file) {
					return (file.indexOf('.') !== 0) && (file !== 'index.js')
				})
				.forEach(function (file) {
					var configModel = require(path.join(modelPath, file));

					if (typeof configModel == 'object' && false) {

						var model = sequelize.define(configModel.name, configModel.fields, configModel.methods, configModel.options);
						modelsName.push(configModel.name)
						if (configModel.hooks) {
							for (var hook in configModel.hooks) {
								model.hook(hook, configModel.hooks[hook]);
							}
						}

						if (configModel.associations)
							associationBuffer.push({
								callback: configModel.associations,
								model: model
							})
						me.bundles[bundle].modelsConfig[model.name] = configModel
						if (fs.existsSync(path.join(modelPath, '..', 'Repositories', file))) {
							var repo = require(path.join(modelPath, '..', 'Repositories', file))
							repo.R = me
							model = lodash.extend(model, repo)

						}

						me.bundles[bundle].models[model.name] = model
					}

					if (typeof configModel == 'function') {
						var model = require(path.join(modelPath, file));
						//me.app.configure(model);
						var model = sequelize.import(path.join(modelPath, file))
						if (fs.existsSync(path.join(modelPath, '..', 'Repositories', file))) {
							var repo = require(path.join(modelPath, '..', 'Repositories', file))
							repo.R = me
							model = lodash.extend(model, repo)

						}
						me.bundles[bundle].models[model.name] = model
					}



				})
			if (initRepo) {
				for (var i = 0; i < associationBuffer.length; i++) {
					associationBuffer[i].callback.call(this, associationBuffer[i].model, this)
				};
				modelsName.forEach(function (modelName) {
					if (sequelize.models[modelName].associate)
						sequelize.models[modelName].associate(sequelize.models, me);
					if (sequelize.models[modelName].initRepo)
						sequelize.models[modelName].initRepo(sequelize.models, me);
				})

			}
		}




	},

	/**
	 * Devuelve si existe una configuracion de base de datos activa
	 */
	hasDatabaseConfig: function () {
		if (this.options.database && this.options.database.name && this.options.database.user) {
			if (this.options.database.state) {
				if (this.options.database.state == 'on')
					return true;
				else
					return false;
			} else {
				return true;
			}
		}
	},
	/*
	* Raptor.js - Node framework
	* 
	* Inicia el servidor web en el puerto
	* definido en la configuracion
	*/
	startServer: function () {
		var me = this;
		if (this.options.http !== false) {
			var http = require('http')
			var server = http.createServer(this.app);
			var socketinfo = '';
			if (this._io) {
				this.io = this._io(server);
				socketinfo = ', \x1b[33;1msocket.io\x1b[22;39m también está escuchando';
			} else {
				/**if(this.options.mode=="development"){
					this._io = require('socket.io')
					this.io = this._io(server);
					socketinfo = ', \x1b[33;1msocket.io\x1b[22;39m fue activado adicionalmente en modo desarrollo';
				}*/
			}
			var status = true;
			server.listen(this.app.get('port'), function () {
				me.status = me.RUNNING;

				console.log('Raptor.js está escuchando en el puerto ' + me.app.get('port') + socketinfo)
				/**if(me.options.mode=="development"){
					
					me.io.on('connection', function(socket) {  
						console.log('Un cliente se ha conectado');
						//socket.emit('startserver',{state:true});
						if(status)
							me.io.sockets.emit('startserver',{state:true});
						status=false
					});
				}*/
				me.emit('serverrunning')
				me.emit('ready')
			});
		} else {
			this.emit('ready')
		}

	},
	/*
	* Raptor.js - Node framework
	* 
	* Busca los componentes definidos en
	* src
	*/
	lookModules: function () {
		var rutaSrc = this.basePath + '/src';
		var me = this;
		//me.hooks.config('before').resolve(me)
		me.emit('before:configure')
		fs
			.readdirSync(rutaSrc)
			.forEach(function (file) {

				fs
					.readdirSync(path.join(rutaSrc, file))
					.filter(function (fileNode) {
						var sub = fileNode.substring(fileNode.length - 4);

						return (fileNode.indexOf('.') !== 0) && (fileNode !== 'index.js') && (sub == 'Node')
					})
					.forEach(function (comp) {

						me.registerComponent(comp, file)

					})

			})


		for (var bundle in me.bundles) {
			me.validateComponent(bundle)
		}

		me.emit('after:configure')
		//me.hooks.config('after').resolve(me)
	},


	/**
	 * Registra un componente en el sistema
	 * @param {string} comp nombre del componente
	 * @param {string} vendor nombre del vendor
	 * @param {boolean} validate si sera validado por el gestor de componentes, dependecias hacia
	 * otros componentes
	 */
	registerComponent: function (comp, vendor, validate) {
		var rutaSrc = path.join(this.basePath, 'src');
		var me = this;
		if (!fs.existsSync(path.join(rutaSrc, vendor, comp, 'manifest.json'))) {
			var data = {
				state: true,
				name: comp,
				version: '1.0.0'
			}
			fs.writeFileSync(path.join(rutaSrc, vendor, comp, 'manifest.json'), JSON.stringify(data, null, 2))
		}

		if (fs.existsSync(path.join(rutaSrc, vendor, comp))) {

			var index = require(path.join(rutaSrc, vendor, comp));
			if (typeof index == 'function') {
				if (!me.bundles[comp]) {
					me.bundles[comp] = {
						name: comp,
						path: path.join(vendor, comp),
						vendor: vendor,
						manifest: require(path.join(rutaSrc, vendor, comp, 'manifest.json')),
						main: index,
						instance: false,
						controllers: [],
						models: {},
						init: false,
						modelsConfig: {},
						middlewares: [],
						hooks: {
							middleware: function (point) {
								if (point == 'before') {
									if (!this._beforeMiddleware)
										this._beforeMiddleware = Promise.defer()
									return this._beforeMiddleware;
								}
								if (point == 'after') {
									if (!this._afterMiddleware)
										this._afterMiddleware = Promise.defer()
									return this._afterMiddleware;
								}
							},
							config: function (point) {
								if (point == 'before') {
									if (!this._beforeConfig)
										this._beforeConfig = Promise.defer()
									return this._beforeConfig;
								}
								if (point == 'after') {
									if (!this._beforeConfig)
										this._beforeConfig = Promise.defer()
									return this._beforeConfig;
								}
							}
						}
					}
					if (validate == true)
						this.validateComponent(comp)

				} else {
					//console.error('The Raptor Node component ['+comp+'] cannot be defined, another component exists with the same name')
				}
			}
		}
	},


	/**
	 * Valida si el componente se encuentra en un estado activo
	 * @param {string} bundle nombre del componente
	 */
	validateComponent: function (bundle) {
		var me = this;
		if (!me.bundles[bundle].init) {
			var fullfill = true
			for (var depend in me.bundles[bundle].manifest.require ? me.bundles[bundle].manifest.require : {}) {
				var requestDepend = me.bundles[bundle].manifest.require[depend];

				if (!(me.bundles[depend] && me.bundles[depend].manifest.state && semver.satisfies(me.bundles[depend].manifest.version, requestDepend))) {
					fullfill = false
				}

			}
			if (!fullfill || me.bundles[bundle].manifest.state != true) {
				if (me.bundles[bundle].manifest.state == true && !fullfill) {
					console.log(format.get("El componente " + me.bundles[bundle].name + " no fue activado por dependencias incompletas (require " + Object.keys(me.bundles[bundle].manifest.require).join(', ') + ")", format.RED))
				}
				delete me.bundles[bundle];
				return;
			}
			var main = new me.bundles[bundle].main()
			me.bundles[bundle].instance = main;

			if (main.configure && me.on) {
				//me.bundles[bundle].hooks.config('before').resolve(me)
				me.emit('before:invoke.configure', me.bundles[bundle])
				me.emit('before:' + bundle + '.configure', me.bundles[bundle])
				$injector.process(main.configure, main)

				//me.bundles[bundle].hooks.config('after').resolve(me)
				me.emit('after:' + bundle + '.configure', me.bundles[bundle])
				me.emit('after:invoke.configure', me.bundles[bundle])
			}
			//Nueva forma de llamar los middleware v2.0.0
			if (main.middleware) {
				me.on('run.middlewares', function () {
					me.emit('before:invoke.middleware', me.bundles[bundle])
					me.emit('before:' + bundle + '.middleware', me.bundles[bundle])
					$injector.invoke(main.middleware, main)
					me.emit('after:' + bundle + '.middleware', me.bundles[bundle])
					me.emit('after:invoke.middleware', me.bundles[bundle])
				})
			}
			var directives = lodash.extend(this.defaultPrepareComponentsOptions, this.options.prepareComponents)

			me.on('run.prepare', function () {

				me.prepareComponent(bundle, directives)

			})
			me.bundles[bundle].init = true;
		}
	},

	/**
	 * Raptor.js - Node framework
	 * @deprecated a remover en proximas versiones
	 *
	 * Lee los componentes para inicializarlos
	 * 
	 */
	prepareNodeComponents: function () {
		deprecate("function R.prepareNodeComponents")
		var directives = lodash.extend(this.defaultPrepareComponentsOptions, this.options.prepareComponents)

		for (var bundle in this.bundles) {

			for (var directive in directives) {

				if (typeof directives[directive] == 'function') {

					directives[directive].call(this, this, this.bundles[bundle])
				}
			}
		}
		//console.info(this.bundles)
	},

	/**
	 * Prepara un componente segun las directivas por defecto
	 * @param {string} bundle nombre del componente
	 * @param {object} direct directivas a utilizar en caso de que se tengas cargadas, OPCIONAL
	 */
	prepareComponent: function (bundle, direct) {
		var directives;
		if (direct)
			directives = direct;
		else
			directives = lodash.extend(this.defaultPrepareComponentsOptions, this.options.prepareComponents)

		for (var directive in directives) {

			if (typeof directives[directive] == 'function') {

				directives[directive].call(this, this, this.bundles[bundle])
			}
		}
	},

	/**
	 * @deprecated marcado para remocion
	 */
	runComponentsMiddlewares: function () {
		deprecate("function R.runComponentsMiddlewares")
		var me = this;
		this.hooks.middleware('before').resolve(this)
		me.emit('before:middleware')
		for (var bundle in me.bundles) {
			var main = new me.bundles[bundle].main()
			if (main.middleware) {
				me.emit('before:' + bundle + '.middleware', me.bundles[bundle])
				me.bundles[bundle].hooks.middleware('before').resolve(me)
				$injector.process(main.middleware, main)
			}
			me.emit('after:' + bundle + '.middleware', me.bundles[bundle])
			me.bundles[bundle].hooks.middleware('after').resolve(me)
		}

		this.hooks.middleware('after').resolve(this)
		me.emit('after:middleware')
	},

	/**
	 * Raptor.js - Node framework
	 * 
	 * Directivas de preparacion por defecto de los conceptos
	 * del los modulos
	 */
	defaultPrepareComponentsOptions: {
		/**
		 * Raptor.js - Node framework
		 * Reconoce y prepara los controladores de un componente, ya se desconoce por
		 * completo la configuracion de controlador en objetos, solo clases ES6
		 *
		 * @todo Es posible que se evite crear una nueva instancia del bundle
		 *
		 * @param {object} R Instancia de la aplicacion Raptor
		 * @param {object} bundle Componente leido
		 *
		 */
		controllers: function (R, bundle) {

			var rutaSrc = R.basePath + '/src';
			var pathController = path.join(rutaSrc, bundle.path, 'Controllers');


			var mainInstance = bundle.instance;
			var prefix = (mainInstance.prefix) ? mainInstance.prefix : '';
			var routes = R.getAnnotationRouteConfig(path.join(rutaSrc, bundle.path, 'index.js'))
			if (typeof routes == 'string')
				prefix = routes
			R.emit('before:prepare.controller', bundle)
			if (fs.existsSync(pathController)) {

				fs
					.readdirSync(pathController)
					.filter(function (file) {
						return (file.indexOf('.') !== 0) && (file !== 'index.js')
					})
					.forEach(function (file) {

						var controller = require(path.join(pathController, file))

						/**
						 * @deprecated este tipo de objeto no esta recomendado y en desuso, utilizar
						 * clases ES6
						 */
						if (typeof controller == 'object') {

							var commonJSPrefix = '';
							if (controller['prefix'] && typeof controller['prefix'] == 'string')
								commonJSPrefix = controller['prefix'];

							var controllerInstance = new R.Controller(R, prefix + commonJSPrefix, mainInstance, R.mainNodeBundle(mainInstance, R, bundle));

							for (var i in controller) {

								if (typeof i == 'string') {
									if (i !== 'prefix') {
										if (typeof controller[i] == 'function') {
											controllerInstance.route('all', i, controller[i])
											//R.app.all( prefix + commonJSPrefix  + i , R.proxy( R.mainNodeBundle(mainInstance,R,bundle) , controllerInstance), R.proxy(controller[i],controllerInstance))
										}

										if (typeof controller[i] == 'object') {
											if (controller[i]['method']) {
												controllerInstance.route(controller[i]['method'], i, controller[i].action)
											} else {
												controllerInstance.route('all', i, controller[i].action)
											}
										}
									}
								}

							}

							bundle.controllers.push(controller);
						}

						/**
						 * Clase ES6
						 */
						if (typeof controller == 'function') {
							var claseES6 = new controller(R, prefix, mainInstance, R.mainNodeBundle(mainInstance, R, bundle));

							R.emit('init:' + bundle.name + '.' + controller.name + '', claseES6, path.join(pathController, file), bundle)
							R.emit('init:controller', claseES6, path.join(pathController, file), bundle)
							if (claseES6.configure) {

								bundle.controllers.push(claseES6);
								$injector.process(claseES6.configure, claseES6)
								R.emit('config:' + bundle.name + '.' + controller.name + '', claseES6, path.join(pathController, file), bundle)
								R.emit('config:controller', claseES6, path.join(pathController, file), bundle)
								var route = R.getAnnotationRouteConfig(path.join(pathController, file), claseES6)

								if (typeof route == "object") {
									claseES6.routes(route)
									R.emit('routes:' + bundle.name + '.' + controller.name, claseES6, path.join(pathController, file), bundle)
									R.emit('routes:controller', claseES6, path.join(pathController, file), bundle)
								}
							}
						}

					})

			}
			R.emit('after:prepare.controller', bundle)

		},

		/**
		 * Raptor.js - Node framework
		 * @todo evaluar realizar la lectura de modelos aqui, aunque en este punto no se
		 * ha encendido el servidor de base de datos
		 *
		 * @param {object} R Instancia de la aplicacion Raptor
		 * @param {object} bundle Componente leido
		 */
		models: function (R, bundle) {

		},

		/**
		 * Lee la internacionalizacion del componente
		 * 
		 * @param {object} R Instancia de la aplicacion Raptor
		 * @param {object} bundle Componente leido
		 */
		i18n: function (R, bundle) {
			var i18nLocation = path.join(R.basePath, 'src', bundle.path, 'i18n', 'language.json');
			if (fs.existsSync(i18nLocation)) {
				var def = require(i18nLocation);
				__i18nDefinition[bundle.name] = def;
			}
		},

		/**
		 * Lee y guarda la referencia al compressor de recursos web del componente
		 * 
		 * @param {object} R Instancia de la aplicacion Raptor
		 * @param {object} bundle Componente leido
		 */
		compressor: function (R, bundle) {
			var compressor = path.join(R.basePath, 'src', bundle.path, 'Compressor', 'Compress.js');

			if (fs.existsSync(compressor)) {

				bundle.compressor = require(compressor);

			}
		},

		/**
		 * @deprecated Nada que hacer aca!!, a remover pronto
		 * @param {object} R Instancia de la aplicacion Raptor
		 * @param {object} bundle Componente leido
		 */
		resources: function (R, bundle) {

			/**
			var rutaSrc=R.basePath+'/src';
			var pathResources=path.join(rutaSrc,bundle.path,'Resources');

			if(fs.existsSync(pathResources)){
				var mod={
					name:'',
					time: (new Date).getTime()
				}

				fs.watch(pathResources,{recursive:true}, function (event, filename) {

					if(filename!==mod.name){
				 		mod.time=(new Date).getTime();
				 		mod.name=filename;
				 		
				 		R.copyResources(event,filename,pathResources,bundle,R)
				 	}else{
					 	if((new Date).getTime()-mod.time>=500){
					 		mod.time=(new Date).getTime();
					 		mod.name=filename;
					 		R.copyResources(event,filename,pathResources,bundle,R)
					 	}else
					 		mod.time=(new Date).getTime();
					}	

				 	return;
				});
			}*/
		}

	},

	/**
	 * Utilitario para copiar los recursos de un componente hacia public/rmodules
	 * 
     * @param {string} bundle nombre del componente
	 * @param {function} callback funcion a ejecutar luego de la rutina de copia
	 * @param {boolean} preCompile precompilar los recursos copiados, se reconocen por defecto extjs
	 */
	copyResources: function (bundle, callback, preCompile) {

		if (typeof bundle == 'string') {
			if (this.bundles[bundle])
				bundle = this.bundles[bundle];
			else
				return;
		}

		if (true) {
			var pathResources = path.join(this.basePath, 'src', bundle.path, 'Resources');
			var R = this;
			if (typeof callback == 'boolean') {
				preCompile = callback;
				callback = function () { }
			}
			if (!callback) {
				preCompile = false;
				callback = function () { }
			}

			try {
				fse.removeSync(path.join(this.basePath, '/public/rmodules/', bundle.path));
				//fse.ensureDirSync(path.join(this.basePath,'/public/rmodules/',bundle.path))
				fse.ensureDirSync(pathResources)

				/**fse.walk(pathResources)
					.on('data', function (item) {
						console.log(item.path)
					})*/
				if (fs.existsSync(pathResources)) {
					//console.log('copy',bundle.name)
					fse.copySync(pathResources, path.join(this.basePath, '/public/rmodules/', bundle.path));
					if (preCompile) {
						this.extjs.preCompileApp(path.join(R.basePath, 'public/rmodules', bundle.vendor, bundle.name));
						this.backbone.preCompileApp(path.join(R.basePath, 'public/rmodules', bundle.vendor, bundle.name));
					}

					callback()
				}
				//}

				//console.log(format.get('Los recursos del módulo '+bundle.name+' fueron publicados en public/rmodules.',format.BLUE))
			} catch (err) {
				console.log(format.get(err, format.RED))
				return false;
			}
		}

	},

	/**
	 * Raptor.js - Node framework
	 * Ejecuta la rutina de entrada al componente
	 * 
	 * 
	 * @param {function} mainClass Clase principal del bundle
	 * @param {object} R Referencia a la clase core de Raptor
	 * @param {object} bundle Configuracion del bundle
	 *
	 */
	mainNodeBundle: function (mainClass, R, bundle) {
		return function (request, response, next) {
			request.language.initBundle(bundle);

			if (mainClass.entrance) {
				$injector.process(mainClass.entrance, mainClass)
			}

			next();
		}
	},


	/**
	 * Raptor.js - Node framework
	 *
	 * Devuelve los modelos del componente especificado o false si el componente
	 * no existe
	 *
	 * @author William Amed
	 * @param {string} bundle Nombre del componente del cual se obtendran los modelos
	 * @return {object|false} Modelos del componente especificado
	 */
	getModels: function (bundle) {
		if (this.bundles[bundle])
			return this.bundles[bundle].models;
		else
			return false;
	},

	/**
	 * Raptor.js - Node framework
	 *
	 * Devuelve la clase principal del componente especificado
	 *
	 * @author William Amed
	 * @param {string} name Nombre del componente del cual se obtendra la clase principal
	 * @return {function|null} Clase principal del componente especificado
	 *
	 */
	requireNode: function (name) {
		var module = name.split('/')

		if (this.bundles[module[0]] && fs.existsSync(path.join(this.basePath, 'src', this.bundles[module[0]].path))) {
			if (module.length > 1)
				return require(path.join(this.basePath, 'src', this.bundles[module.shift()].path, module.join('/')));
			else
				return require(path.join(this.basePath, 'src', this.bundles[module[0]].path));
		} else
			return null;
	},

	/**
	 * Devuelve la direccion absoluta del recurso especificado relativamente al componente
	 * Ej. R.resolveLocal("exampleNode/Lib/MyClass.js")
	 * devuelve C://Project/Raptor.js/src/exampleNode/Lib/MyClass.js
	 * 
	 * @param {string} name ruta relativa al componente especificado
	 * @returns {string|null}
	 */
	resolveLocal: function (name) {
		var module = name.split('/')

		if (this.bundles[module[0]] && fs.existsSync(path.join(this.basePath, 'src', this.bundles[module[0]].path))) {
			if (module.length > 1)
				return (path.join(this.basePath, 'src', this.bundles[module.shift()].path, module.join('/')));
			else
				return (path.join(this.basePath, 'src', this.bundles[module[0]].path));
			//return path.join(this.basePath, 'src', this.bundles[name].path);
		} else
			return null;
	},
	/**
	 * Hace un require al recurso relativo a la ruta del componente que se le especifique.
	 * Ej. R.resolveLocal("exampleNode/Lib/MyClass.js")
	 * devuelve el resultado del module.exports
	 * 
	 * @param {string} name ruta relativa al componente especificado
	 * @returns {string|null}
	 */
	requireLocal: function (name) {

		if (this.bundles[name] && fs.existsSync(path.join(this.basePath, 'src', this.bundles[name].path))) {
			return require(path.join(this.basePath, 'src', this.bundles[name].path));
		} else
			return null;
	},

	/**
	 * Raptor.js - Node framework
	 * Mapea un valor del body del request con una propiedad del objeto especificado
	 *  Ej.
	 *  house={
	 *     owner:{
	 *		 name: 'initial name'
	 *     }
	 *  }
	 *  req.mapOption('fullname','owner.name',house)
	 *
	 * 
	 * @param {string} name Nombre del valor que viene en el body del request
	 * @param {string} propiedad Nombre y posicion de la propiedad a mapear en el objeto ej.'objeto.otrapropiedad.name'
	 * @param {object} Objeto que sera mapeado
	 * @return {function} Middleware para mapear valores del request contra un objeto
	 */
	mapOption: function () {
		var self = this;
		return function (req, res, next) {
			req.mapOption = function (field, option, original, formato) {

				if (field) {
					var splited = option.split('.');
					var value = req.body[field];
					if (typeof formato == 'function')
						var value = formato(value)
					original = self.recursiveOption(splited, value, 0, original)

					return original;

				}

			}
			next()
		}
	},

	/**
	 * Middleware de registro de viewPlugin en el request de express
	 * @private Uso privado del framework
	 */
	requestViewPlugin: function () {
		return function (req, res, next) {

			req.viewPlugin = {
				__plugins: {},
				set: function (name, value) {
					if (this.__plugins[name])
						this.__plugins[name].push(value)
					else
						this.__plugins[name] = [value]
				},
				get: function (name) {
					if (this.__plugins[name])
						return this.__plugins[name];
					else
						return [];
				},
				remove: function (name) {
					if (this.__plugins[name])
						this.__plugins[name] = [];
				},
				removeAll: function () {
					this.__plugins = {};
				}
			}
			next()
		}
	},

	/**
	 * Raptor.js - Node framework
	 * Funcion utilitaria
	 * 
	 * @private Usado por el Map options para hacer busquedas recursivas de propiedades
	 * 
	 */
	recursiveOption: function (list, value, pos, object) {
		if (list.length - 1 > pos) {
			object[list[pos]] = this.recursiveOption(list, value, pos + 1, object[list[pos]]);
			return object;
		} else {
			object[list[pos]] = value;
			return object;
		}

	},

	/**
	 * Utilidad para esperar por una respuesta sincrona
	 * @deprecated Propuesto a remocion en favor de asyc/wait
	 */
	waitUntil: function (cond) {
		deprecate("function R.waitUntil")
		while (cond) { }
	},

	/**
	 * Devuelve la definicion del SecurityRegistry para adicionarlo al inyector
	 * @private Uso exclusivo del framework
	 */
	__getSecurityRegistry: function () {
		var me = this;
		return {
			__container: {},
			register: function (name) {
				var reg = me.getSecurityManager(name);
				this.__container[name] = reg;
				return this.__container[name];
			},
			get: function (name) {
				if (this.__container[name])
					return this.__container[name]
			}
		}
	},

	/**
	 * Devuelve una instancia de un SecurityManager con el nombre especificado
	 * @param {string} name nombre del SecurityManager
	 * @returns {SecurityManager} Instancia de SecurityManager
	 */
	getSecurityManager: function (name) {

		var _securityManager = require('./SecurityManager');

		return new _securityManager(name);

	},

	/**
	 * @deprecated propuesto a remocion, en desuso
	 */
	aop: {
		before: function (obj, method, advice) {
			deprecate("function R.aop.before")
			var before = obj[method];
			var orig = [];
			orig.push(function () {
				return before.apply(obj, arguments)
			})
			obj[method] = function () {
				return advice.apply(obj, orig.concat(arguments))
			}
		}
	},


	/**
	 * @deprecated Cuando se hizo Dios y yo sabiamos que hacia, ahora solo dios los sabe
	 */
	stackUtil: function (_stack, callback, scope) {
		deprecate("function R.stackUtil")
		var pos = 0;
		var self = this;
		var stack = _stack ? _stack : [];
		return {

			begin: function () {
				this.nextPos(pos);
			},
			nextPos: function (position) {
				if (position < stack.length) {
					if (scope)
						self = scope
					if (typeof callback == "function")
						callback.apply(self, [stack[position]]);
					this.nextPos(position + 1)
				}

			}
		}
	},

	/**
	 * Ejecuta las directivas de migracion de un componente
	 * @param {string} name nombre del componente
	 * @param {string} action nombre de la accion a realizar, las acciones permitidas son create y export
	 * por defecto se toma create
	 */
	migration: function (name, action) {
		var me = this;
		//return new Promise(function (resolve, reject) {

		//me.on('serverrunning', function () {
		if (!action)
			action = 'create'
		if (!me.database.sequelize) {
			//reject();
			return new Promise(function (resolve, reject) { resolve() });
		}

		if (me.bundles[name] && fs.existsSync(path.join(me.basePath, 'src', me.bundles[name].path)) && fs.existsSync(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/skeleton.js")) {

			var done = function (msg) {
				if (msg)
					console.log(msg)
				else {
					//resolve()
					console.log("Migration done!!")
				}
			}
			var save = function (makeData) {
				fs.writeFileSync(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/data.json", JSON.stringify(makeData))
			}
			console.log("Running migration for bundle " + name)
			var migration = require(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/skeleton")
			var queryInterface = me.database.sequelize.queryInterface;
			var data = {};
			if (fs.existsSync(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/data.json"))
				data = require(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/data.json");

			migration.createTableFromModel = function (model) {

				return queryInterface.createTable(model.tableName, model.tableAttributes)
			}



			var routing = function (tableNames) {
				me.migrationTables = {}
				for (var i = 0; i < tableNames.length; i++) {
					me.migrationTables[tableNames[i]] = true
				};
				migration.tables = me.migrationTables
				migration.watch = migration.watch ? migration.watch : [];
				var flagExist = 0;

				for (var i = 0; i < migration.watch.length; i++) {
					if (migration.tables[migration.watch[i]])
						flagExist++

				};
				var doneCreate = function (msg) {
					if (msg)
						console.log(msg)
					else {
						reindex(function () { })
						//resolve()
						console.log("Migration done!!")
					}
				}
				var reindex = function (callback) {
					if (me.database.sequelize.options.dialect == 'postgres' || me.database.sequelize.options.dialect == 'oracle')
						for (var i = 0; i < migration.watch.length; i++) {
							(function () {
								var table = migration.watch[i];
								me.database.sequelize.query('select max(' + me.getModels(name)[migration.watch[i]].primaryKeyAttributes[0] + ') from ' + migration.watch[i])
									.then(function (max) {

										return me.database.sequelize.query("ALTER SEQUENCE " + table + "_id_seq START WITH " + (max[0][0].max + 1) + " RESTART");
									})
									.then(function () {
										console.log("Reindex sequence done!!")

									})
									.catch(function () {

									})
							})()

						}
				}


				if (action == 'create') {


					if (flagExist == 0) {
						return migration[action](queryInterface, me, data, doneCreate)

					} else {
						//resolve()
						done('No migration needed')
						return new Promise(function (resolve, reject) { resolve() });

					}

				}
				if (action == 'export')
					if (flagExist == migration.watch.length && !fs.existsSync(path.join(me.basePath, 'src', me.bundles[name].path) + "/Migration/data.json"))
						return migration[action](queryInterface, me, done, save)
					else {
						//resolve()
						done('No migration export needed(Delete the data.json file to force a new migration data file)')
						return new Promise(function (resolve, reject) { resolve() });

					}
				if (action == 'destroy')
					return migration[action](queryInterface, me, data, done)

			}

			if (true)
				return queryInterface.showAllTables().then(routing)
			else {
				routing(Object.keys(me.migrationTables))
			}


		} else {
			console.error('No migration file for bundle ' + name)
			return new Promise(function (resolve, reject) { resolve() });
			//reject()
		}
		//})
		//})

	},

	/**
	 * Lee las anotaciones de rutas en los controladores y index de los bundles
	 * @private
	 * @param {string} file ruta del archivo js
	 * @param {object} scope Ambito de variables donde se ejecutaran las anotaciones
	 */
	getAnnotationRouteConfig: function (file, scope) {
		// parse the annotations from a file, default parse ES6 file, Reader.ES5 to force ES5
		var reader = new this.annotations.Reader(this.annotationFramework.registry, scope);



		reader.parse(file);


		//console.log(reader)
		// get the annotations
		const definitionAnnotations = reader.definitionAnnotations
		const constructorAnnotations = reader.constructorAnnotations
		const methodAnnotations = reader.methodAnnotations
		const propertyAnnotations = reader.propertyAnnotations

		// loop through and handle the annotations
		var routes = {}
		var prefix = ''

		definitionAnnotations.forEach((annotation) => {
			// @Route
			if (annotation.annotation === 'Route') {
				prefix = annotation.value
			}
		})


		methodAnnotations.forEach((annotation) => {
			// @Route
			//console.log(annotation,"routes",annotation instanceof require('raptorjs/lib/Annotation/Route'))
			if (annotation.annotation === 'Route') {

				if (annotation.method)
					routes[prefix + annotation.value] = { method: annotation.method, action: scope ? scope[annotation.target] : annotation.target, chain: annotation.chain }
				else
					routes[prefix + annotation.value] = { method: 'all', action: scope ? scope[annotation.target] : annotation.target, chain: annotation.chain }
			}
		})
		if (methodAnnotations.length == 0)
			return prefix;
		return routes;
	},

	/**
	 * Crear una instancia del annotationFramework, registro en el
	 * injector de dependencias
	 */
	_configReadAnnotation: function () {
		const annotations = require('ecmas-annotations')
		// create the registry
		this.annotationFramework = {
			registry: new annotations.Registry()
		}

		// create the annotation reader
		this.annotationFramework.reader = new annotations.Reader(this.annotationFramework.registry)
		// add annotations to the registry
		this.annotationFramework.registry.registerAnnotation(require.resolve(__dirname + '/Annotation/Route'))

		var parse = annotations.Reader.prototype.parse;

		annotations.Reader.prototype.parse = function () {
			(function (toString) {
				Buffer.prototype.__tString = toString
				Buffer.prototype.toString = function () {
					return toString.apply(this, arguments).replace(/\r\n/gm, "\n");
				};
			})(Buffer.prototype.toString);

			parse.apply(this, arguments);

			(function (toString) {

				Buffer.prototype.toString = function () {
					return toString.apply(this, arguments);
				};
			})(Buffer.prototype.__tString);
		}

		this.annotations = annotations;
		$injector('Annotations', annotations)
		this.annotationFramework.Annotations = annotations
		$injector('AnnotationFramework', this.annotationFramework)

	},

	/**
	 * Compara versiones
	 * @param {string} v1 version1 a comparar
	 * @param {string} v2 version2 a comparar
	 * @param {object} options [Opcional] opciones de comparacion, options.lexicographical y options.zeroExtend
	 * 
	 */
	versionCompare: function (v1, v2, options) {
		var lexicographical = options && options.lexicographical,
			zeroExtend = options && options.zeroExtend,
			v1parts = v1.split('.'),
			v2parts = v2.split('.');

		function isValidPart(x) {
			return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
		}

		if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
			return NaN;
		}

		if (zeroExtend) {
			while (v1parts.length < v2parts.length) v1parts.push("0");
			while (v2parts.length < v1parts.length) v2parts.push("0");
		}

		if (!lexicographical) {
			v1parts = v1parts.map(Number);
			v2parts = v2parts.map(Number);
		}

		for (var i = 0; i < v1parts.length; ++i) {
			if (v2parts.length == i) {
				return 1;
			}

			if (v1parts[i] == v2parts[i]) {
				continue;
			}
			else if (v1parts[i] > v2parts[i]) {
				return 1;
			}
			else {
				return -1;
			}
		}

		if (v1parts.length != v2parts.length) {
			return -1;
		}

		return 0;
	},

	/**
	 * Devuelve la plantilla ejs compilada perteneciente a un componente
	 * Ej. R.template("exampleNode:mi.plantilla.ejs")
	 * Ubicada en src/vendor/exampleNode/Views/mi.plantilla.ejs
	 * 
	 * @param {string} a ruta relativa al componente
	 * @param {object} b Parametros a pasar a la plantilla
	 * @returns {string} resultado de la plantilla
	 */
	template: function (a, b) {
		var div = a.split(':')
		var viewFn = new ViewFunctions(R);
		viewFn.__setRequest(this.req);
		b = lodash.extend((b) ? b : {}, { R: viewFn });

		if (div.length == 2 && $injector('R').bundles[div[0]]) {
			var view = path.join($injector('R').basePath, 'src', $injector('R').bundles[div[0]].path, 'Views', div[1]);

			return $injector('R').ejs.render(fs.readFileSync(view).toString(), b)
		} else {
			return $injector('R').ejs.render(fs.readFileSync(a), b)
		}

	},

	/**
	 * Crea un archivo de bloqueo de nodemon, raptor-cli lo interpreta como una orden
	 * para no reiniciar el servicio en modo de desarrollo hasta que se desbloquee
	 */
	lockNodemon: function () {
		fs.writeFileSync(path.join(this.basePath, 'cache', 'nodemon.lock'), '');
	},

	/**
	 * Desbloquea nodemon en modo de desarrollo para que continue su logica
	 */
	unlockNodemon: function () {
		var self = this
		setTimeout(function () {
			//Solo en modo de desarrollo
			if (fs.existsSync(path.join(self.basePath, 'cache', 'nodemon.lock')))
				fse.removeSync(path.join(self.basePath, 'cache', 'nodemon.lock'));
		}, 3000)
	}
}


/**
 * Configura por demanda el acceso a las propiedades del objeto R definidas en defered 
 */
for (const key in defered) {
	if (defered.hasOwnProperty(key)) {
		let element = defered[key];
		Object.defineProperty(module.exports, key, {
			get: function () {
				var val = element.apply(this, []);
				Object.defineProperty(this, key, {
					value: val
				})
				return val;
			},
			configurable: true
		});
	}
}



