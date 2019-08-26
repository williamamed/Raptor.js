2.0.9 / 2019-08-03
-------------------
- Se crea el CHANGELOG.md de raptor-cli.
- Se corrigió el error que impedía el inicio de raptor-cli por no encontrar el directorio Commands en los componentes de la ubicación compartida de desarrollo.
- En el empaquetado del cli los componentes de desarrollo son instalados en el primer uso del cli.
- Se añadió la opción -v para retornar la versión de raptor-cli, sigue estando disponible la opción -V
- Arreglado el error en el comando install (self.validate is not a function)
- Actualizado el paquete por defecto para crear proyectos, generador de modelos de sequelize-auto a sequelize-auto-v2 para soporte a versiones v5 de sequelize
- Registrar sequelize-auto-v2 en los devDependencies
- Arreglado el error en el comando install (self.validate is not a function), en el componente RaptorNode de la ubicación compartida

2.1.0 / 2019-08-12
-------------------
- Actualizado el Core a la versión 2.0.1, nueva forma de lectura de configuración, ENV.RAPTOR_OPTIONS, options.json y options.prod.json, modificada la clase SecurityManager
- Actualizado TroodonNode, revisado el api para JSON WEB TOKENS
- Actualizado RaptorNode, cambio en la rutina de lectura de configuración, leer solamente el options.json
- Actualizadas plantillas para crear un proyecto
- Migrado todos los componentes hacia paquetes NPM
- Creado nuevo paquete @raptorjs/troodon
- Creado nuevo paquete @raptorjs/orm
- Creado nuevo paquete @raptorjs/core
- Creado nuevo paquete @raptorjs/ng-portal
- Creado nuevo paquete @raptorjs/bio
- Creado nuevo paquete @raptorjs/extjs
- Creado nuevo paquete @raptorjs/raptor-panel
- Creado nuevo paquete @raptorjs/apidoc
- Creado nuevo paquete @raptorjs/extjs-designer
- Creado nuevo paquete @raptorjs/template-gen

2.1.1 / 2019-08-22
-------------------
- Arreglado el componente orm que no permitia ejecutar las migraciones de componentes externos como troodon.
- Arreglado el comando run para reconocer las ubicaciones compartidas.
- Actualizado el core que en su liberación 2.1.0 no reconocia el modo de desarrollo.
- Agregado al componente orm la configuracion de base de datos en modo de desarrollo.

2.1.3 / 2019-08-26
-------------------
- Agregado los privilegios dinamicos al componente troodon.
- Arreglado en el cli la lectura de componentes en el scope @raptorjs
- Agregado al core la lectura de anotaciones @Inyectable, @Controller
- Arreglado en el core el register del securityRegistry
- Actualizada la documentacion
- Arreglado el panel de control la escritura del perfil de usuario.
- Arreglado el ngPortal para la lectura de privilegios dinamicos
- Agregado a troodon el TroodonDataService para recuperar los servicios independientemte del modo.
