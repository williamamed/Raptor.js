Raptor.js v2.2.0
=======
<img style="" src="/public/@raptorjs/core/img/raptorjs-full.png" height="90">

Raptor.js es un framework de node creado, impulsado y mantenido por el Proyecto Raptor.

Raptor.js es un framework web full stack basado en Node.js, utiliza como core el microframework express de conjunto con otros módulos utilitarios del repositorio npm que permiten el desarrollo de aplicaciones web de forma ágil.

El proyecto propone una arquitectura basada en componentes, donde las responsabilidades de la lógica de nuestra aplicación se encuentran encapsuladas dentro de componentes.

La solución incluye un marco de abstracción de seguridad integrado en un módulo (TroodonNode) que garantiza la implementación de los procesos de identificación-autenticación, autorización y auditoría. Implementa una extensión de los modelos de control de acceso RBAC y CAEM. Además cuenta con un módulo de reconocimiento biométrico por dinámica de tecleo (BioNode), que se inserta dentro del proceso de identificación-autenticación del módulo de seguridad.

Agradecer a todos los colaboradores que hacen posible el proyecto Raptor.

Comenzando
---------------
La nueva serie 2 (versiones igual o superiores a 2.0.0) de Raptor.js trae cambios significativos, el primero está relacionado a su instalación. Esta versión ya está disponible como paquete en el npm y para la creación de un proyecto Raptor.js es necesario la instalación de la herramienta de desarrollo raptor-cli que te asistirá en la creación de proyectos.


### Instalando cli

El cli puede ser instalado tanto del npm como localmente si tenemos las fuentes del paquete.
Desde el npm:
``` batch
> npm install raptor-cli -g
```

Desde las fuentes:
``` batch
> npm install ./raptor-cli.tgz -g
```
Al instalar globalmente el paquete cli a través de flag -g tendremos accesibles en nuestro equipo el comando `rap`.

### Comandos

Una vez instalado el cli podemos usar los comandos disponibles para crear y correr nuestro proyecto.

`create <nombre>`: El comando create crea un nuevo proyecto en el directorio actual con la estructura de la arquitectura propuesta por raptor, adicionalmente crea el package.json e instala las dependencias básicas (node_modules) del proyecto. Desde la versión 2.1.0 fue removida la opción install-offline.

Se incluye desde la versión 2.2.0 el soporte a instalación de conjunto con frameworks como Angular.

``` batch
> rap create MyApp
```

`run [verbose] [arguments]`: El comando run corre el proyecto del directorio actual en modo de desarrollo, entre otras funciones utiliza nodemon para vigilar los cambios en el proyecto y reiniciar el servicio.

``` batch
> rap run
```

`comp, --create-component`: Crea un nuevo componente dentro del proyecto actual, este comando lanzará un prompt requiriendo el nombre del agrupador y componente.

``` batch
> rap comp
```

`env [set | get | delete | list] <key> <value>`: Modifica las variables de entorno que serán pasadas al proyecto a ejecutar. Es útil para configurar locaciones compartidas del proyecto así como otros parámetros de configuración.

``` batch
> rap set RAPTOR_EXTERNAL_COMPONENT C:\\UbicacionCompartida
```

``` batch
> rap get RAPTOR_EXTERNAL_COMPONENT
```

``` batch
> rap list
```


Capítulo 2 – Arquitectura
===========

Las responsabilidades de la lógica de nuestra aplicación se encuentran encapsuladas dentro de componentes, cada componente es ubicado dentro de directorios conocidos como agrupadores o vendors encontrados en la raíz del directorio src.

Además del directorio src encontrarás los siguientes archivos:

`config`: Contiene el archivo options.json con la configuración global del framework.

`public`: Directorio de recursos web, se encuentran las bibliotecas utilizadas del lado del cliente, bootstrap, extjs, angular.js, socket.io y el directorio rmodules que contiene los recursos web de los componentes en src (son copiados por el cli automáticamente en modo de desarrollo).

`src`: Fuentes de nuestra aplicación en forma de componentes reutilizables, los componentes son reconocidos por el sufijo Node, ejemplo exampleNode.

`node_modules`: Directorio de dependencias de paquetes utilizados por el framework.

`app.run.js`: Entrada de ejecución del proyecto en modo de producción.

`bootstrap.js`: Archivo de arranque, utilizado tanto en modo de producción como desarrollo.

`package.json`: Configuración del paquete de proyecto, dependencias utilizadas etc.

Configuración general
-----
Esta configuración sirve como directivas generales para el framework, se establecen en el archivo `options.json` y `options.prod.json` en el directorio `config` de nuestro proyecto. Raptor espera que algunas de las directivas expresadas sean obligatorias, es posible además establecer algunas directivas personalizadas. Desde la versión 2.1.0 se introduce el archivo `options.prod.json`, es la configuración que será leída en modo de producción.

Directivas en options.json.

`mode`: Determina el modo en que correrá el proyecto, acepta 2 valores, development o production. Cuando el modo development se encuentre activo aparecerá en cada ventana el panel minificado con datos básico del request actual, además se activarán algunas opciones de traceo para un mejor proceso de desarrollo.


`port`: Puerto en el que estará escuchando el servidor web, por defecto Raptor propone el 4440.

`socketio`: Tecnología de conexión bidireccional por socket, establece el objeto de configuración del socket de conexión.

`socketio.active`: Establece si socketio estará activo o no, espera como valor un booleano.

`language`: Objeto de configuración del lenguaje, es usado por Raptor para configurar el idioma por defecto.

`language.default`: Lenguaje por defecto, se especifica la abreviatura del lenguaje a utilizar, ejemplo “es”.

`language.usePrefered`: Determina si Raptor deberá darle prioridad a la directiva enviada por el navegador de lenguaje de preferencia, espera como valor un booleano.

`language.cookieName`: Nombre de la cookie de lenguaje.

`secret`: Llave secreta generada, es utilizada en el framework como semilla para los procesos de cifrado y configuración de sesiones.

`proyectName`: Nombre del proyecto, generalmente es establecido en el propio panel.

`http`: (Opcional, Modo de desarrollo) Array con los patrones de archivos a ignorar por raptor-cli (nodemon).

`scopes`: (Opcional) Array con los nombres de los scopes, indica al framework que debe leer cada uno de estos scope en node_modules en busca de nuevos componentes Raptor.js, es útil cuando instalamos un componente Raptor.js a través del npm y es ubicado en el directorio node_modules, Raptor lee por defecto el scope @raptorjs donde están ubicados los componentes del core del framework.

`publish`: (Opcional) Objeto con los nombres de las tecnologías ubicadas en node_modules que queremos exponer a través de express en el directorio public del framework, pueden ser bootstrap, angularjs etc.

`maxEventListeneres`: Límite máximo de subscripciones a eventos que el core de Raptor.js soportará, por defecto el valor aparece en 80.


``` json
{
  "mode": "development",
  "port": 4440,
  "socketio": {
    "active": false
  },
  "language": {
    "default": "es",
    "usePrefered": false,
    "cookieName": "RpsLang"
  },
  "panel": {
    "secure": true,
    "password": "admin",
    "username": "admin"
  },
  "secret": "3dfa5h2g$ae946e2gdi5cb%g*1#$5e25",
  "proyectName": "RaptorJS"
}
```

Arquitectura de un componente
-----
Los componentes son la base fundamental del framework, toda la lógica de la aplicación estará descrita en ellos. Un principio fundamental es que cada componente debe ser independiente en funcionamiento siempre que sea posible, aunque se pueden establecer dependencias entre ellos. Debido a este principio Raptor promueve las relaciones débiles en forma de introspección, permitiendo que ante la ausencia de una dependencia de componente el sistema continúe su funcionamiento mediante otro flujo de ejecución.

Cada componente posee un manifiesto (`manifest.json`) que describe los metadatos del componente, nombre, versión, descripción y si tiene alguna dependencia con otro componente. En caso de poseer una dependencia el componente será desactivado si esta no se puede resolver.

``` json
{
  "state": false,
  "name": "troodon",
  "author":"William Amed - watamayo90@gmail.com",
  "description":"Descripción del componente",
  "version": "1.0.1",
  "require":{
    "core":">=1.0.1"
  }
}

```

Adicionalmente también contará con un archivo (`package.json`) que describe al componente y sus dependencias ante el gestor de paquetes npm.

``` json
{
  "name": "@raptorjs/troodon",
  "author":"William Amed - watamayo90@gmail.com",
  "description":"Descripción del componente",
  "version": "1.0.1",
  "dependencies":{
    "fs-extra":">=1.0.1"
  }
}

```

Ubicaciones compartidas
-----
A partir de la versión 2.0.7 el framework soporta las ubicaciones compartidas, tanto para ambientes de desarrollo como de producción. En principio la ubicación principal de un componente será el directorio src del propio proyecto en ejecución, además podrán ser configuradas otras locaciones donde se encontrarán componentes de uso común para otros proyectos.


### Ubicaciones de uso común

Otras ubicaciones que pueden ser configuradas son las ubicaciones de uso común, representan ubicaciones que se compartirán entre proyectos que usan los  mismos componentes utilitarios de producción ej. ngPortal. El objetivo es centralizar el componente, evitar la duplicidad de código que conlleva a una mejor mantención.

Las ubicaciones de uso común son configuradas a través de la variable de entorno `RAPTOR_EXTERNAL_COMPONENT`, donde se especifica la dirección física donde se encuentran los componentes.

<img style="width: 100%" src="/public/@raptorjs/apidoc/img/share2.png" >

Estructura del componente
-----
Los componentes son la base principal de nuestro proyecto, toda la arquitectura está basada en la comprensión del concepto componente, la lógica de nuestra aplicación deberá estar contenida en uno que de principio puede ser independiente en funcionamiento de otro componente aunque pueden establecerse dependencias.

Un componente está organizado de la siguiente forma:
### Controllers
`Controllers`: En el directorio Controllers estarán los controladores de nuestro componente, son descritos utilizando la especificación ES6 y la clase definida deberá extender de Controller. Los controladores servirán como forma de definición de acciones para ejecución de patrones de ruta, para esto se utilizará la anotación @Route, que le podrá ser especificada la ruta, method, before (array con acciones a realizar delante de la función actual), after (array con acciones a realizar detrás de la función actual). Luego de los parámetros req, res, next podrán ser inyectadas dependencias definidas en el DI(Inyector de dependencias) de Raptor.

``` javascript
'use strict';

/**
 * prefijo de ruta todas las definiciones en el controlador
 * 
 * @Route("/example") 
 * @Controller
 */
class MiControlador {

    configure() {

    }

    /**
     * @Route("/uno",method="all")
     */
    unoAction(req, res, next) {
        res.send('hola ruta')
    }

    /**
     * @Get("/dos")
     */
    dosAction(req, res, next) {
        res.send('hola ruta dos')
    }

    /**
     * @Post("/tres")
     */
    tresAction(req, res, next) {
        res.send('hola ruta tres')
    }

}

module.exports = MiControlador;

```
### Models
`Models`: Contendrá los modelos sequelize generados, la forma en que se definen puede consultarse en la documentación del orm sequelize, Raptor.js genera automáticamente estas clases  a partir del panel de control de forma visual e intuitiva.
``` javascript
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
```
### Repositories

`Repositories`: Los repositorios no son un concepto manejado por sequelize sino que son controlados por Raptor.js, la filosofía de repositorios se hereda de otras tecnologías para cumplir el principio de división de responsabilidades en los modelos, separar el mapeo relacional de la lógica de consultas. En Raptor es vital separar los modelos (Models) mapeados de la definición de consultas o funciones definidas para estos modelos (Repositories), ya que si se remapea un modelo el repositorio se encarga de mantener las funciones personalizadas definidas para él.
``` javascript
'use strict';
module.exports={
    initRepo:function(){
        //algunas tareas al inicializar el modelo
        //Por ejemplo, establecer las relaciones con otros modelos.
	    //Si se remapea el modelo de este repositorio por algún cambio
        //en los campos de la tabla, este repositorio no se vería afectado
        //manteniendo las consultas personalizas programadas anteriormente
    },    
    getUsers:function(query){
        return this.findAll(query);
    }
}
```

### i18n

`i18n`: Este directorio contiene un archivo denominado language.json, en este son configurados los mensajes para cada uno de los idiomas que soporta el componente, cada mensaje está representado en un objeto donde para cada idioma es establecido la traducción correspondiente.
``` json
{
    "prueba":{
        "en": "test",
        "ru": "тест"
    }
}
```
### Resources

`Resources`: En este directorio estarán todos los recursos web utilizados del lado del cliente, css, imágenes y archivos javascript, aunque este directorio no está público para el servidor web raptor-cli se encarga de copiar automáticamente estos recursos hacia el directorio public para que sean visibles, son copiados en la misma estructura propuesta en src.

Un archivo ejemplo.css ubicado dentro del directorio Resources será cargado en nuestra plantilla de la siguiente forma:
``` html
<link href="/public/Hola/exampleNode/ejemplo.css">
```
A partir de la versión 2.1.0 Raptor expone un middleware encargado de resolver los recursos ubicados en el directorio Resources de cada componente, todas las rutas que comiencen con /public pasarán por este middlare en busca de los recursos web especificados.

Este principio de funcionamiento refuerza la modularidad del componente, donde podemos reutilizar el componente simplemente copiando el mismo hacia el proyecto que deseemos.

### Views

`Views`: Aquí estarán todas las plantillas del componente, Raptor utiliza como motor de plantillas a Ejs, a las plantillas es posible pasarle datos que serán compilados e insertados dentro de la definición html descrita.
``` html
<html>
    <body>
        <b>hola mundo <%= msg %></b>
    </body>
</html>
```
### index.js

`index.js`: Esta clase representa la entrada lógica principal de cada componente, posee un grupo de funciones que le dan configuración al componente así como definir el prefijo de ruta del componente, hacer introspección, capturar eventos y definición de middlewares en el stack de express.
``` javascript
'use strict';
/**
* Raptor.js - Node framework
* 
* @Route("/example")
*/
class exampleNode {
   /**
    * 
    */
    middleware(router){
        
    }

   /**
    * 
    */
    configure(R){
        
    }

}
module.exports=exampleNode
```

Capítulo 3 – Clase principal (index.js)
===========

La clase index.js ubicada en cada componente es la entrada lógica principal del mismo, representa al componente en términos de funcionamiento ante el core de Raptor y se encarga de configurar opciones globales para su funcionamiento. En la clase se configurarán 3 conceptos principales, el prefijo de ruta del componente, la configuración inicial y middlewares o rutas que deseemos registrar.

Prefijo de ruta
-----

El prefijo de ruta del componente sirve como forma de agrupación de las rutas que se registren en este propio componente, si se establece significa que todas las rutas declaradas en los controladores dentro del componente tomarán como prefijo el establecido en esta clase.

``` javascript
'use strict';
/**
* Raptor.js - Node framework
* 
* @Route("/examples")
*
*/
class exampleNode {
   /**
    * 
    */
    middleware(router){
        
    }

   /**
    * 
    */
    configure(R){
        
    }

}
module.exports=exampleNode
```

En el ejemplo se puede apreciar que la clase principal exampleNode define un prefijo de ruta `/examples` a través de la anotación `@Route`, significa que si dentro de este componente se define por ejemplo una ruta `/users`, entonces la ruta de acceso en el navegador será `/examples/users`. 

Configuración
-----

La configuración inicial se realiza a través del método `configure` presente en esta clase, este método se invoca una vez que el servidor arranca y el core de Raptor ha leído y preparado los metadatos del componente. El método es llamado una sola vez, antes que incluso se configure el stack de express, por lo que sirve para realizar acciones de registro de middlewares personalizados e introspección en el propio funcionamiento del framework.
Es posible además suscribirse a eventos generados por el framework y otros componentes a través del objeto Events que puede ser inyectado en el método.

``` javascript
'use strict';
/**
* Raptor.js - Node framework
* 
* @Route("/example")
*/
class exampleNode {

    middleware(router){

    }

   /**
    * Raptor.js - Node framework
    * 
    * Entrada de configuracion del componente
    * se ejecuta cuando se registran los componentes
    * 
    * `@param` Raptor R instancia de la aplicacion Raptor
    *
    */
    configure(R, Events, express) {

        Events
            .register({
                'ready': function () {
                    console.log("Raptor.js listo y escuchando.")
                },
                'database:running':function(){
                    console.log("La base de datos se encuentra corriendo")
                }
            })
        
        express.use(function(req,res,next){
            /**
             * Registro de un middleware de express
             * antes de que Raptor comience a agregar los
             * middleware por defecto
             */
            next()
        })
    }

}

module.exports=exampleNode
```
Middlewares
-----
Para entender un poco de que se trata esta configuración hay que definir qué es un middleware y que función tiene dentro del framework. Raptor.js utiliza a Express como marco de aplicación web o marco de servidor estándar para encargarse del manejo del direccionamiento web y provee todas las funciones básicas del manejo del protocolo http.

Express se basa en un concepto llamado stack de middlewares, no es más que una consecución de bloques de código encapsulados en funciones que se encargan de manipular la petición (Request) y respuesta (Response) para otorgar una función en específico al framework. Adicionalmente cada middleware posee una referencia al próximo middleware dentro del stack (el mismo principio que una lista simplemente enlazada).

En un servidor con express son configurados un conjunto de middlewares indispensables, encargados de manipular las cabeceras de la petición entrante antes de que llegue al enrutador, el enrutador que también es un middleware manipula el request para encontrar una ruta definida que coincida con el patrón de ruta de la petición (digamos /user/list), en caso de encontrarlo lo ejecuta y se detiene la ejecución del stack, en caso contrario invoca al próximo middleware del stack. Generalmente luego del enrutador se registra un middleware que servirá una página 404, esto se debe a que por lógica si el enrutador no encontró una ruta registrada entonces el próximo middleware es el manejador de la lógica que se encargará de informar al usuario de una página no encontrada.

Raptor.js configura todos estos conceptos por nosotros y solo debemos preocuparnos de definir nuestros patrones de ruta. En algunos casos necesitamos registrar nuestros propios middlewares que queramos ejecutar antes o después del enrutador, para esto utilizamos la función middleware definida en la clase index de cada componente. En esta función podemos registrar tanto un middleware como un patrón de ruta que queramos ejecutar antes de los patrones de ruta definidos en el propio componente.

``` javascript
'use strict';
/**
* Raptor.js - Node framework
* 
* @Route("/examples")
*
*/
class exampleNode {
   

    middleware(express, router){
        //express.use espera una función que representa el middleware
        express.use(function(req,res,next){
            /**
             * Le añadimos al objeto request una función 
             * personalizada que estará diponible
             * en los middlewares subsiguientes
             */
            req.funcionPersonalizada=function(){
                res.send("hola mundo")
            }
            /**
             * Ejecutamos el próximo middleware 
             * del stack para continuar 
             * con el flujo de la aplicación
             */
            next()
        })
        //Registro de un patrón de ruta directamente en el enrutador
        router.all("/user/list",function(req,res,next){
            /**
             * Ya en el enrutador podemos utilizar la 
             * función definida en el request, anteriormente
             * definido por nuestro middleware
             */
            req.funcionPersonalizada()
        })

    }

   
    configure(R){
        
    }

}
module.exports=exampleNode
```

Es posible además registrar middlewares para el manejo de excepciones luego que se ejecute el enrutador, ya que nuestra lógica siempre contendrá de alguna forma excepciones personalizadas, un middleware que las gestione resulta en una solución elegante y reutilizable.

``` javascript
'use strict';
/**
* Raptor.js - Node framework
* 
* @Route("/examples")
*
*/
class exampleNode {
   

    middleware(express, router){
        express.use(function(err,req,res,next){
            /**
             * Si se define el parámetro err
             * el middleware es ejecutado cuando
             * exista un error en los middlewares
             * superiores del stack
             */
            console.log(err)
        })

    }

   
    configure(R){
        
    }

}
module.exports=exampleNode
```

Capítulo 4 – Controladores
======
Los controladores son clases definidas dentro del directorio Controllers, encargados de la descripción de la interacción entre la capa de presentación (Frontend) y la capa de negocio (Backend). Estas clases heredan de Controller y en ellas pueden ser definidos metadatos en forma de anotaciones (@Route) que lo vinculan con el enrutador, pudiendo en ellas definirse respuestas a determinados patrones de ruta o sea peticiones hechas a través de un cliente http.

A partir de la versión 2.1.3 se comienza a utilizar la anotación @Controller para marcar la clase como controladora, sigue teniendo soporte legacy la herencia de R.Controller. Al existir la anotación @Controller en la definición de la clase el framework internamente preparará la herencia sobre la clase R.Controller.

``` javascript
'use strict';

/**
 * prefijo de ruta todas las definiciones en el controlador
 * 
 * @Route("/example") 
 * @Controller
 */
class MiControlador {

    configure() {

    }

    /**
     * @Route("/holaruta")
     */
    holaRuta(req, res, next) {
        res.send('hola ruta')
    }

}

module.exports = MiControlador;
```
Lo anterior es el equivalente a invocar directamente:
``` javascript
router.all("/example/holaruta",function(req,res,next){
   res.send("hola ruta")
})
```

Debido un principio arquitectónico, de mantenibilidad y escalabilidad, los controladores ofrecen mejores características además de un soporte directo al DI (Inyector de dependencias) de Raptor.js que estaremos abordando más adelante.
En las anotaciones @Route pueden ser especificadas otras funciones que queramos ejecutar antes o después de la función marcada con la anotación. Los atributos utilizados para este propósito son before y after, donde ambos esperan un array con las referencias de las funciones que queremos ejecutar.
``` javascript
    holaMundoPrimero(req,res,next){
        console.log('Esta función se ejecuta primero en el stack !!')
        //Darle paso al próximo elemento en el stack
        next()
    }

    /**
     * @Route("/ejemplo/holamundo",before=[this.holaMundoPrimero])
     */
    holaMundo(req,res,next){
        console.log("Esta función se ejecuta después");
        res.send("Hola mundo !!")
    }
```

De igual manera también podemos ejecutar funciones luego de la función principal
``` javascript
    holaMundoUltima(req,res,next){
        console.log('Esta función se ejecuta último en el stack !!')
        
    }

    /**
     * @Route("/ejemplo/holamundo",after=[this.holaMundoUltima])
     */
    holaMundo(req,res,next){
        console.log("Esta función se ejecuta primero");
        res.send("Hola mundo !!")
        //Darle paso al próximo elemento en el stack
        next()
    }
```


Capítulo 5 – Inyector de dependencias ($injector)
=====
El DI o inyector de dependencias aparece en esta serie 2 de Raptor.js y juega un papel fundamental en la nueva concepción del framework, resulta indispensable conocer su funcionamiento ya que los objetos, clases y funciones utilitarias, son registradas en el contenedor de dependencias del inyector con el fin de hacerlos accesibles desde cualquier parte de nuestra aplicación. Su concepción estuvo basada en el popular inyector propuesto por AngularJS aunque existen patrones bien definidos sobre esta técnica.

El core de Raptor.js configura el inyector a través del objeto global $injector, significa que estará accesible desde cualquier lugar y en cualquier momento de ejecución del framework. El contenedor del inyector almacena las dependencias en forma clave-valor, donde la clave con la que se registra una dependencia será el nombre con la que será accesible.

Un ejemplo de registro de dependencia.
``` javascript
  var persona=new Persona();
  $injector("ObjetoPersona",persona)
```

Al registrar en el contenedor la instancia o dependencia podemos desde cualquier lugar de nuestra app obtener la instancia registrada.

Existen 2 formas fundamentales de consumir la instancia registrada, directa y por inyección, la forma directa involucra el llamado al objeto global $inyector pasándole como único parámetro el nombre de la dependencia que se desea obtener, mientras que por inyección se basa en invocar una función que recibirá como parámetros las dependencias requeridas en la propia función.

Forma directa:
``` javascript
  var persona=$injector("ObjetoPersona")
  persona.nombre()
```
Por inyección:
``` javascript
        /**
         * El método invoke ejecuta automáticamente la
         * función especificada, resolviendo las
         * dependencias descritas en los parámetros de dicha
         * función, los nombres de los parámetros deberán
         * coincidir con la clave con la que fue registrada
         * la dependencia
         */
        $injector.invoke(function(ObjetoPersona){
            ObjetoPersona.nombre()
        })

        /**
         * invokeLater es similar, en vez de ejecutar
         * automáticamente la función devuelve otra función que luego será
         * ejecutada con la resolución de las dependencias
         */
        $injector.invokeLater(function(ObjetoPersona){
            ObjetoPersona.nombre()
        })
```
Aunque en los ejemplos se está accediendo directamente desde el inyector, Raptor.js implementa internamente la resolución de dependencias en los métodos configure y middleware de la clase principal index del componente, así como en cada acción de los controladores que definan una ruta.
``` javascript
class exampleNode {

    middleware(SecurityRegistry, Bio, ngPortalRegistry, router){
        //Se pueden inyectar acá todas las dependencias 
        //registradas en el contenedor
        router.post("/api/v2",function(){})
    }
```
En las acciones de los controladores también puede hacerse uso del inyector de dependencias luego de los parámetros obligatorios req, res y next.
``` javascript
    /**
     *  El prefijo de esta ruta es el declarado en la cabecera
     *  de esta clase.
     *  Pueden ser inyectadas las dependencias requeridas a continuación
     *  de req,res,next
     *  
     *  @Get("/holaruta")
     * 
     */
    holaRuta(req, res, next, SecurityRegistry, Op, sequelize, queryInterface) {
        /**
         * Las inyecciones de dependecias Op, sequelize y queryInterface
         * solo estarán disponibles si existe una conexión exitosa con
         * una base de datos
         */
        res.send('hola ruta')
    }
```
Raptor.js configura en el inyector un grupo de dependencias del propio framework así como otras dependencias configuradas por los componentes instalados. En el siguiente listado se encuentran las dependencias registradas por Raptor.

Inyectado desde anotación
-----
En la versión 2.1.3 del core se incluye la forma de inyectado por anotación, esta técnica solo podrá ser usada en los métodos de las clases ES6. Debes tener en cuenta que las acciones de un controlador marcadas con @Route ya realizan está técnica para la resolución de dependencias.

Concretamente podemos marcar los métodos de una clase con la anotación `@Injectable` para resolver dependencias, esto evita que en algunos casos podamos envitarnos llamar a `$i.invoke` directamente.

``` javascript
/**
 * 
 * 
 * @Route("/galaxia")
 * @Controller
 */
class Thanos{

	configure(){
		
    }
    
    /**
     * @Injectable
     */ 
	destroyHumans(Options){
        console.log(Options)
	}

    /**
     * @Get("/gotoearth")
     */
	goToEarthAction(req,res,next){
		this.destroyHumans();
		res.send("Welcome thanos");
	}
}
module.exports=Thanos;
```

``` javascript

class Humanos{

	constructor(){
		
    }
    
    /**
     * @Injectable
     */ 
	caminar(Options, express, SecurityRegistry){
        // Algo que deseas hacer
        express.use(function(req,res,next){
            // y algo más
            next()
        })
	}

    
	empezar(){
		this.caminar();
	}
}
module.exports=Thanos;
```

Dependencias
-----

### sequelize
Instancia creada de la conexión activa con la base de datos configurada por Raptor, aunque esta es la conexión activa principal se pueden crear otras instancias y registrarlas en el contenedor de dependencias. 

Esta dependencia solo estará disponible cuando el componente `orm` este activado.

### queryInterface
Referencia al queryInterface de la instancia principal de sequelize activa.

Esta dependencia solo estará disponible cuando el componente `orm` este activado.

### Op
Objeto que contiene los operadores utilizados en las consultas en sequelize, like, or, and, not etc.., en las últimas versiones del ORM es la forma recomendaba de establecer los operadores en las consultas.

Esta dependencia solo estará disponible cuando el componente `orm` este activado.

### Annotations
Contiene la definición de la clase Reader para leer anotaciones, está determinado por el paquete ecmas-annotations.

### AnnotationFramework
Contiene el registro de anotaciones definidas que serán leídas y procesadas.

### R
Instancia del core de Raptor.

### SecurityRegistry
Objeto que contiene el registro de manejadores de seguridad definidos, los SecurityManager registrados implementan los procesos de autenticación, autorización y auditoria, el componente TroodonNode define su propio manejador en este contenedor.

### router 
Referencia al enrutador de express
### express
Referencia a la app express creada por Raptor.js
### Template404
Contiene la ruta de la plantilla 404 a utilizar por Raptor.js, es posible redefinir esta ruta para establecer una plantilla propia personalizada.
### TemplateBasic
Contiene la ruta de la plantilla genérica a utilizar por Raptor.js, es posible redefinir esta ruta para establecer una plantilla propia personalizada.
### TemplateERROR
Contiene la ruta de la plantilla de error a utilizar por Raptor.js, es posible redefinir esta ruta para establecer una plantilla propia personalizada.
### Events
Objeto para el registro de escuchas de eventos en Raptor.js, es utilizado generalmente en el configurador de componentes escuchando determinados eventos generados por el sistema y por componentes instalados.
### Options
Objeto que contiene la configuración establecida en el archivo options.json.
### io
Referencia a la instancia de socket.io creada.

Esta dependencia solo estará disponible si socket.io se encuentra activo.

### Migration
Objeto que contiene métodos utilitarios de las funcionalidades de migración, Ej. reIndex para reindexar las sequencias en esquemas postgres y Oracle.

Esta dependencia solo estará disponible cuando el componente `orm` este activado.

### Umzug
Gestor de migraciones.

Esta dependencia solo estará disponible cuando el componente `orm` este activado.
### DefaultSession
Contiene un valor booleano que define si se utilizara la sesión por defecto configurada por Raptor.js, es posible manipular este valor para definir un manejador de sesión nuevo.
### nombre-de-componente_nombre-de-modelo
Raptor.js registra además en el contendor las referencias a los modelos sequelize definidos en los componentes instalados. La forma de acceder a ellos mediante el inyector es: nombre del componente sin el sufijo bundle donde está ubicado el modelo, seguido de un guión bajo y luego el nombre del modelo, ejemplo Troodon_security_users, esto se refiere que inyectaremos el modelo security_users que se encuentra en el componente TroodonNode.

Otras dependencias
-----
### ngPortal
Definición de la clase ngPortal del componente ngPortalNode, se utiliza para configurar un portal.

Esta dependencia solo estará disponible cuando el componente `ng-portal` este activado.
### ngPortalRegistry
Registro de instancias de portales creados con ngPortal.

Esta dependencia solo estará disponible cuando el componente `ng-portal` este activado.

### Bio
Objeto registrado por el componente biométrico para la protección con patrón de tecleo de determinadas rutas, a través del método protection devuelve un middleware que será utilizado para controlar el acceso en diferentes rutas.

Esta dependencia solo estará disponible cuando el componente `bio` este activado.

$injector API
-----
### $injector()
`@param` {string} Llave nombre de la dependencia.

`@param` {string} value Valor a registrar en la dependencia especificada.

@return null | mixed

Esta función es utilizada tanto para registrar como para obtener las dependencias, si no se especifica el valor entonces el inyector tratará de devolver la dependencia con la llave especificada, si se especifica el valor el inyector registrara la dependencia especificada.

``` javascript
//set
$injector("myObject",{message:"Hi"})
//get
$injector("myObject")
```
### invoke()
`@param` {Function} funcion Función a invocar utilizando el inyector.

`@return` null | mixed

Ejecuta en el momento la función especificada por parámetro, el DI tratará de inyectar las dependencias especificadas por parámetros en dicha función, devolverá el valor retornado por la función especificada por parámetro.
``` javascript
$injector.invoke(function(sequelize){
    console.log(sequelize)
})
```
### invokeLater()
`@param` {Function} funcion Función a invocar utilizando el inyector.

`@return` Function

Preprocesa la función pasada por parámetro en busca de dependencias definidas y la prepara para ejecución,este método retorna la función preparada.

``` javascript
var nuevaFn=$injector.invokeLater(function(sequelize){
    console.log(sequelize)
})

nuevaFn()
```
Capítulo 6 – Gestor de eventos (Events) 
=====
El core de Raptor.js extiende de EventEmitter, posee un grupo de eventos que lanza en instantes determinados del funcionamiento del framework y una gran parte son ejecutados en la configuración. Aunque el core (R) realmente extiende de EventEmitter es el objeto Events disponible desde el inyector de dependencias el encargado del registro de suscripciones a los eventos generados por el framework. 

Por regla general son utilizados en mayor parte en la realización de introspección, cambio del comportamiento por defecto del framework, inserción de middleware en el stack, etc.
``` javascript
configure(R, Events){
        Events.register({
            'sendresponse':function(){

            },
            'session:config':function(){
                
            }
        })
    }
```
Desde la versión 2.1.5 podemos utilizar la anotación @Event para suscribirnos a eventos desde cualquier clase ES6 incluyendo la clase principal del componente. La implementación anterior podríamos definirla también de la siguiente forma:
``` javascript
class MiComponente{

    /**
     * @Event("sendresponse")
     */
    onSendresponse(){

    }

    /**
     * @Event("session:config")
     */
    onSessionConfig(){
        
    }

    configure(R, Events){
        
    }
}
```
Podemos combinar la anotación `@Event` con `@Injectable` para hacer resolución de dependencias en el método objetivo.
``` javascript
class MiComponente{

    /**
     * @Event("sendresponse")
     */
    onSendresponse(){

    }

    /**
     * @Event("session:config")
     * @Injectable
     */
    onSessionConfig(Options){
        console.log(Options.mode);//development
    }

    configure(R, Events){
        
    }
}
```

La suscripción a determinados eventos es realizada generalmente en el método configure de la clase principal index del componente, ya que nos suscribimos a estos eventos antes de que sean lanzados por el framework producto a que el método configure es una de las primeras rutinas invocadas por Raptor.js. 

Debemos tener en cuenta que la suscripción deberá realizarse antes del lanzamiento de cualquier evento de lo contrario nuestra suscripción nunca será invocada.

A continuación se describen los eventos generados por el framework.

Ejecución de eventos
-----
En una aplicación Raptor.js resulta importante conocer el orden de ejecución de los eventos de la aplicación ya que están divididos en 2 flujos (arranque y trabajo), en estos 2 momentos el framework emite diferentes eventos descritos en el api que permiten la configuración del comportamiento de los componentes y el sistema.

Cuando se indica el inicio de la aplicación primeramente se ejecuta el flujo de `arranque` que permite la configuración del framework y sus componentes, una vez terminado este flujo y el proyecto se encuentra escuchando en el puerto configurado entonces comienza la escucha del flujo de `trabajo` manejado por el marco de aplicación web `express`.

### Flujo de arranque
El flujo de arranque comienza desde que se indica el inicio de la aplicación hasta que Raptor.js emite el evento `ready` y comienza la escucha en el puerto configurado. Este proceso lo podemos observar en el terminal desde que ordenamos el comando `rap run` hasta que el framework emite la señal que se encuentra escuchando en el puerto.

En este espacio de tiempo se lee la configuración en los archivos dispuestos en el directorio config del proyecto, se escanean, leen y configuran los componentes detectados en src, scopes y locaciones compartidas, se configura el stack de middleware de express y finalmente se levanta el servicio web.

El orden de ejecución de los eventos en el flujo de arranque se describe en la siguiente imagen:

<img style="width: 100%" src="./img/arranque.png">

A través del objetos Events nos podemos suscribir a los eventos del flujo de arranque para realizar acciones de configuración en el momento que el framework se encuentra en el proceso de arranque, con el que podemos incluso cambiar el comportamiento por defecto desde un componente creado o importado en el proyecto.

### Flujo de trabajo
El flujo de trabajo comienza una vez el framework indica que se encuentra escuchando en el puerto configurado, y está determinado por el orden de los middlewares en el marco de aplicación express, simplemente un flujo de trabajo es la atención a una petición web entrante hasta que se indica una respuesta desde nuestra aplicación. 

Recuerde siempre que todos los middlewares registrados en el stack de express forman parte del flujo de trabajo, así como las rutas configuradas en nuestro proyecto.

La representación visual del stack de express a través del patrón middleware puede observarse en la siguiente imagen que indica como son procesadas y respondidas las peticiones web entrantes por los diferentes métodos (GET, POST, PUT, DELETE, ALL).

<img style="width: 100%" src="./img/express.png">

Tenga en cuenta que esta gráfica es solo un ejemplo de como funciona el patrón middleware y que no representa exactamente los middleware que Raptor.js configura para el proyecto. Utilizando los eventos del flujo de `arranque` podemos registrar middlewares en posiciones determinadas dentro del stack de middlewares de express que nos permitan atender determinadas peticiones antes o después del enrutador que atiende las rutas configuradas en los controladores.


Eventos
-----
### before:configure
Este evento es lanzado antes de la lectura y configuración de los componentes, o sea antes que sean invocados los configure de cada clase principal de los componentes.

### before:invoke.configure 
`@param` {Object} Objecto de definición de un componente

Evento lanzado antes que se ejecute el método configure de la clase principal del componente, recibe como parámetro el componente actual.

### before:[nombre-componente].configure 
`@param` {Object} Objecto de definición de un componente

Evento lanzado antes que se ejecute el método configure de la clase principal del componente especificado, recibe como parámetro el componente actual.

### after:[nombre-componente].configure 
`@param` {Object} Objecto de definición de un componente

Evento lanzado después que se ejecute el método configure de la clase principal del componente especificado, recibe como parámetro el componente actual.

### after:invoke.configure 
`@param` {Object} Objecto de definición de un componente

Evento lanzado después que se ejecute el método configure de la clase principal del componente, recibe como parámetro el componente actual.

### after:configure 
Este evento es lanzado cuando se ha terminado de ejecutar todos los configure de cada clase principal de los componentes así como su validación por el framework.

### session:config 
`@param` {express-session} Función middleware de definición del manejador de sesiones

Evento lanzado antes que se configure el manejador de sesión por defecto configurado por Raptor, recibe como parámetro el middleware definido por el paquete express-session. Puede ser utilizado para cancelar el manejador por defecto y configurar uno personalizado.
``` javascript
Events.register({
    'session:config':function(session){
        //Reescribiendo el manejador de sesion
        $injector("DefaultSession",false);
        express.use(session({
            secret: R.options.secret,
            store: ... ,
            resave: true,
            saveUninitialized: true,
            cookie: { httpOnly: true }//, secure: true }

        }))
    }
})
```

### helmet:config
`@param` {helmet} Función middleware de definición de helmet

Evento lanzado luego que es configurado el middleware de helmet, recibe como parámetro la definición de helmet importada por Raptor, puede ser utilizada para configurar otros parámetros adicionales. Consultar la documentación de helmet

### before:middleware
Evento lanzado antes que se ejecute el método middleware de la clase principal index de cada componente.

### run.middlewares 
Evento lanzado para invocar la ejecución del método middleware de la clase principal de cada componente.

### before:invoke.middleware 
`@param` {Object} Objecto de definición de un componente

Evento lanzado antes que se ejecute el método middleware de la clase principal del componente, recibe como parámetro el componente actual.

### before:[nombre-componente].middleware
`@param` {Object} Objecto de definición de un componente

Evento lanzado antes que se ejecute el método middleware de la clase principal del componente especificado, recibe como parámetro el componente actual.

### after:[nombre-componente].middleware
`@param` {Object} Objecto de definición de un componente

Evento lanzado después que se ejecute el método middleware de la clase principal del componente especificado, recibe como parámetro el componente actual.

### after:invoke.middleware
`@param` {Object} Objecto de definición de un componente

Evento lanzado después que se ejecute el método middleware de la clase principal del componente, recibe como parámetro el componente actual.

### after:middleware
Evento lanzado después que se ejecute el método middleware de la clase principal index de cada componente.

### before:prepare 
Evento lanzado antes que se ejecute la preparación del componente, la lectura de los controladores, ejecución del configure de cada controller, lectura de anotación de rutas, configuración de rutas, compressor.

### run.prepare 
Evento que invoca la preparación de los componentes.

### before:prepare.controller
`@param` {Object} Objecto de definición de un componente

Evento lanzado antes que se lean y configuren los controladores de un componente, recibe como parámetro el componente actual.

### init:[nombre-componente].[nombre-controlador]
`@param` {Controller} Instancia del controlador incializado

`@param` {String} Ruta absoluta al controlador

`@param` {Object} Objecto de definición de un componente

Evento lanzado cuando se inicializa el controlador y componente especificado, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
``` javascript
Events.register({
    'init:RaptorNode.PanelController':function(controller,ruta,componente){
        
    }
})
```

### init:controller
`@param` {Controller} Instancia del controlador incializado

`@param` {String} Ruta absoluta al controlador

`@param` {Object} Objecto de definición de un componente

Evento lanzado cuando se inicializa el controlador de un componente, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
``` javascript
Events.register({
    'init:controller':function(controller,ruta,componente){
        
    }
})
```

### config:[nombre-componente].[nombre-controlador]
`@param` {Controller} Instancia del controlador incializado

`@param` {String} Ruta absoluta al controlador

`@param` {Object} Objecto de definición de un componente

Evento lanzado después que es ejecutado el método configure del controlador y componente especificado, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.

### config:controller 
`@param` {Controller} Instancia del controlador incializado

`@param` {String} Ruta absoluta al controlador

`@param` {Object} Objecto de definición de un componente

Evento lanzado después que es ejecutado el método configure de cada controlador, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.

### after:prepare.controller
`@param` {Object} Objecto de definición de un componente

Evento lanzado después que son leídos y configurados los controladores de un componente, recibe como parámetro el componente actual.

### after:prepare 
Evento lanzado después que se ejecute la preparación del componente, la lectura de los controladores, ejecución del configure de cada controller, lectura de anotación de rutas, configuración de rutas, compressor.

### config:error.middleware 
Evento lanzado antes de configurar en el stack de express el middleware de gestión de errores, es posible configurar antes un manejador de excepciones personalizado.
``` javascript
Events.register({
    'config:error.middleware':function(){
        express.use(function(err,req,res,next){
            //Logica de control de excepciones
        })
    }
})
```

### serverrunning 
Evento lanzado cuando el servidor http comienza escuchar en el puerto configurado.

### ready 
Evento lanzado cuando el framework ha terminado el flujo de arranque.

### sendresponse 
Lanzado cuando se envía cualquier respuesta hacia el cliente a través del método send, incluye además el render. En la suscripción del evento se recibe como parámetros el request actual y el core (R) del framework en ese orden. Es posible añadir más datos en la respuesta actual a través de los viewPlugins.
``` javascript
Events.register({
    'sendresponse':function(req,R){
          //Escribiendo una respuesta adicional
          if (req.header('accept').indexOf('text/html') != -1)
             req.viewPlugin.set('after_response_body', "<b>Hola mundo</b>")
          }
    })
```

### sendresponse:[urlpath] 
Evento lanzado cuando se envía cualquier respuesta hacia el cliente a través del método send que coincida con el [urlpath] especificado.
``` javascript
Events.register({
    'sendresponse:/raptor/home':function(req,R){
          //Escribiendo una respuesta adicional
          if (req.header('accept').indexOf('text/html') != -1)
             req.viewPlugin.set('after_response_body', "<b>Hola mundo</b>")
          }
    })
```

### error:[code] 
Evento generado cuando ocurra un error que tiene como código el especificado, para que este evento sea lanzado debe de estar registrado en el contenedor de errores del core. En la lógica de la aplicación las excepciones lanzadas deben especificar el código de error que Raptor procesará para invocar este evento.
``` javascript
Errors.register("NOT_FOUND")
Events.register({
    'error:NOT_FOUND':function(err,req,res,next){
        
    }
})
```
### database:running 
Evento lanzado cuando la conexión de base de datos principal (Sequelize) configurada por Raptor se conectó correctamente.

Este evento es lanzado por el componente `orm`

### database:failed 
Evento lanzado cuando ocurrió un error en la conexión de base de datos principal configurada por Raptor.
ready Evento lanzado cuando core ha terminado la configuración y se encuentra listo , tenga en cuenta que es posible que el servidor http o la conexión con base de datos pudieran estar desactivadas.

Este evento es lanzado por el componente `orm`

### ioc:[nombre-dependencia].ready
Evento lanzado cuando el nombre de dependencia especificada ha sido añadida al inyector de dependencias y está listo para consumirse, recibe como parámetro la dependencia recién añadida.

### migration:ready 
Evento lanzado cuando las migraciones están lista para su ejecución, solo le lanzará cuando exista una conexión exitosa con alguno de los motores de base de datos.

Este evento es lanzado por el componente `orm`

### annotation:read.definition.[ClassName]
Evento lanzado cuando las anotaciones de la clase ClassName fueron leídas, recibe como parámetro el tipo de anotación que se leyó (definition) y la definición de la anotación recién leída.

### annotation:read.method.[ClassName]
Evento lanzado cuando las anotaciones de los métodos de la clase ClassName fueron leídas, recibe como parámetro el tipo de anotación que se leyó (method) y la definición de la anotación recién leída.

### AutoResolveAnnotation
`@param` {ecmas-annotations.Reader} Instancia creada para leer las anotaciones

`@param` {String} Ruta del archivo que está siendo analizado

`@param` {Mixed} El dato del archivo resuelto a través del require

Evento lanzado cuando se abre un archivo por primera vez por la instrucción require, permite analizar a través del Reader si cuenta con las anotaciones definidas en la lista AnnotationFramework.autoResolve

Envió de eventos personalizados
-----
Teniendo en cuenta que el core de Raptor extiende de EventEmitter podemos además enviar nuestros propios eventos personalizados lanzados desde nuestros componentes a través del uso de la función emit del core, en próximas versiones también estará disponible desde el objeto Events.
``` javascript
configure(R, Events){
        Events.register({
            'exampleNode.configured':function(param){
                console.log(param)
            }
        })
        R.emit("exampleNode.configured","hola mundo")
    }
```

Capítulo 7 – ViewPlugins
===
Los ViewPlugins es una de las funciones propuestas en el framework Raptor PHP 2 y que ahora son implementados para Raptor.js, permite la inyección de contenido en los hotpots declarados en el sistema para determinados patrones de ruta. Es un mecanismo útil en la realización de introspección en la capa de presentación, permitiendo incluso la definición de puntos calientes personalizados.

La funcionalidad de ViewPlugin puede ser encontrada definida dentro del request de la petición actual, este objeto contiene un grupo de funciones para el manejo de este concepto.

req.viewPlugin
-----
### set()

`@param` {string} name nombre del hotpot donde se insertará el contenido.

`@param` {string}  value Valor a registrar en la dependencia especificada.

Esta función es utilizada en la inserción de contenido en el hotpot deseado.

### get()
`@param` {string} name nombre del hotpot.

@return Array

Devuelve un array con todo el contenido insertado para un hotpot

### remove()
`@param` {string} name nombre del hotpot.

Elimina todo el contenido insertado para el hotpot especificado.

### removeAll()
Elimina todo el contenido de todos los hotpot definidos

Hotpot definidos por defecto
-----
### before_response_body
punto de inserción antes del cuerpo html de cada respuesta, solo es aplicable a todos los response que rendericen contenido HTML.

### after_response_body
 punto de inserción después del cuerpo html de cada respuesta, solo es aplicable a todos los response que rendericen contenido HTML.
``` javascript
req.viewPlugin.set('after_response_body','<script>alert("hola mundo")</script>')
```

### raptor_client 
punto de inserción dentro del objeto Raptor definido en cada página HTML renderizada, el valor insertado en este punto deberá ser una definición válida de objeto de configuración donde el objeto debe contener una llave name que representa el nombre con que será accedida la propiedad que podrá ser una función, un objeto o un string.

``` javascript
req.viewPlugin.set('raptor_client',{
    name:"myProperty",
    callback: function(){
        alert("hola mundo")
    }
})

req.viewPlugin.set('raptor_client',{
    name:"myProperty2",
    callback: {
        age: 25,
        lastname: "Adam"
    }
})

```

Capítulo 8 – ViewFunctions 
===
Los ViewFunctions son funciones definidas para su utilización en las plantillas ejs, estas funciones son implementadas por Raptor.js y comprenden la definición de puntos calientes (hotpot), acceso a la internacionalización así como la definición de tokens CSRF.

API
-----

### R.plugin()
`@param` {string} hotpot  nombre del hotpot deseado

@return {Array}
Retorna todo el contenido registrado para el hotpot especificado.

``` html
<%- R.plugin('ngPortal_name') %>
```
### R.flash()
`@param` {string} nombre nombre del mensaje flash configurado en el request.

@return {string}

Devuelve el valor del mensaje flash configurado en el request.

### R.lang()
`@param` {string} tag nombre del tag que contiene el texto del mensaje.

`@param` {string} componente [opcional] nombre del componente en donde se buscará el tag del mensaje.

@return {string}

Devuelve el mensaje definido para el tag especificado en el idioma actual configurado para el sistema.

### R.csrfField()
@return {string}

Devuelve una definición en modo texto de un input type=hidden que contiene el token CSRF del request actual.

### R.csrfToken()
@return {string}

Devuelve el valor del  token CSRF del request actual.

Capítulo 9 – Internacionalización 
===
La internacionalización del framework permite la utilización del lenguaje configurado para el sistema a través de la definición de las traducciones de mensajes en cada componente. En el directorio i18n de cada componente se encontrará un archivo language.json que define los lenguajes que soporta el componente.
``` javascript
{
    "prueba":{
        "en": "test",
        "ru": "тест"
    }
}
```
Las llaves de esta definición representa el nombre del mensaje, mientras que dentro se especifican para cada abreviatura de lenguaje la traducción correspondiente.

Las funciones de acceso a la internacionalización han sido definidas en el request actual y en las plantillas ejs, estas permiten el acceso a los mensajes definidos en la internacionalización según el lenguaje establecido en el sistema.

req.language
-----
En el request actual se encuentra la definición del objeto language configurado por uno de los middleware del framework. Contiene un grupo de métodos que permiten la manipulación de las funciones del lenguaje.

Adicionalmente a este api en el request estará disponible la función abreviada lang, esta permite el acceso a la internacionalización en el componente donde se invoque, la función lang es el método de acceso abreviado a `req.language.getTranslation`.
``` javascript
req.lang('error_message')
```

### getCurrentLanguage()
@return {string} abreviatura del lenguaje actual

Devuelve la abreviatura del lenguaje activo

### setCurrentLanguage()
`@param` {string} abbr abreviatura del lenguaje a utilizar.

Establece el lenguaje a través de su abreviatura.
``` javascript
req.language.setCurrentLanguage("es");
```

### persistCookie()
@return {boolean}

Persiste el lenguaje actual en la cookie de lenguaje, esto significa que el lenguaje establecido será el preferido para las próximas peticiones.

### setUsePreferedLanguage()
`@param` {boolean} prefered valor para determinar si se usa el lenguaje del agente de usuario, true para usarlo.

Establece si el framework deberá tener como prioridad el lenguaje del agente de usuario

### getTranslation()
`@param` {string} tag, Etiqueta del mensaje que se desea del lenguaje actual.

`@param` {string} component, Componente donde se buscará la etiqueta especificada como primer argumento.

@return {string}

Devuelve la traducción de la etiqueta especificada para el lenguaje actual (currentLanguage)


Capítulo 10 – Migrations 
===
Las migraciones en tecnologías como sequelize son un concepto diseñado originalmente para controlar las actualizaciones del esquema de base de datos. Para Raptor.js este concepto se encuentra en evolución y en estas primeras versiones se enfoca en la creación, eliminación y exportación de estos esquemas, en próximas versiones se incluirá el soporte a la actualización de los esquemas creados.

Raptor.js a partir de la versión 2.0.5 delega las funciones de migración en el paquete Umzug, con soporte completo a las funcionalidades propuestas por el ORM sequelize.

Las migraciones solo estarán disponibles cuando el framework detecte una configuración activa con la base de datos configurada.

Dentro de cada componente podremos definir la migración creando un directorio Migrations que contendrá un archivo en estándar common js con extensión .mig.js, además en el inicio del nombre del archivo se describirá el número de la versión de la migración y seguidamente de un guión se especificará el nombre de la migración, ejemplo: `01-troodontables.mig.js`

Este archivo básicamente describirá la forma en que se crean y modifican los esquemas, es necesaria en este archivo la definición de dos métodos up y down donde se describirá la lógica.

Formato del migration
-----
``` javascript
module.exports={
    up: $i.later(function(query,datatype,Bio_biouser){
        return Bio_biouser.sync()
    }),
    down:function(query){
        return query.dropTable('biouser')
    }
}
```
Cada una delas funciones recibirá como parámetros el queryInterface de sequelize así como el datatype, adicionalmente es posible inyectar otros parámetros usando el inyector de dependencias como aparece en la gráfica anterior.

Ejecución de un Migration
-----
Para ejecutar una migración debemos utilizar el objeto Umzug presente en el inyector de dependencias, este objeto cuenta con los métodos down y up que podemos invocar pasándole como parámetro las migraciones que deseamos ejecutar. Para más información puede encontrar la documentación de Umzug en línea así como de Sequelize.
``` javascript
Umzug.up(["01-mistablas.mig", "02-misdatos.mig"])
    .then(function (migrations) {
        console.log('Esquemas de tablas insertadas!!')
    })
    .catch(function (err) {
        console.log(err.message)
    })
```

Podemos invocar los migration utilizando en el evento `migration:ready` generado por el propio framework
``` javascript
    /**
     * Correr migraciones
     */
    'migration:ready': $i.later(function (Umzug) {

        Umzug.up(["01-mistablas.mig","02-misdatos.mig"])
        .then(function (migrations) {
            console.log('Esquemas de tablas insertadas!!')
        })
        .catch(function (err) {
            console.log(err.message)
        })

    })
```

Capítulo 11 – Core de Raptor.js (R) 
===
El core de Raptor.js fue movido desde esta serie 2 hacia el interior de la arquitectura, específicamente el componente CoreNode, dentro encontramos un directorio Source que contiene todas las funciones específicas del núcleo del framework. Raptor.js define un objeto R que representa el core del framework y se encuentra accesible de forma global al igual que el $injector, en próximas versiones el acceso global al objeto R será removido ya que podrá será accesible a través del propio inyector.

El objeto R hereda de EventEmitter, por lo a través de este se pueden escuchar y lanzar eventos.

Propiedades
-----
### bundles
@type {Object} Contiene la definición leída de los componentes reconocidos por Raptor en el directorio src.

``` javascript
{
    name: 'exampleNode',
    path: '...',
    absolutePath: '...',
    vendor: 'Raptorjs',
    manifest: {
        name:"exampleNode",
        version:"0.0.1",
        state:true
    },
    main: new exampleNode(),
    instance: true,
    controllers: [...],
    models: { ... },
    init: false,
    modelsConfig: { ... },
    middlewares: [...]

}
```

### basePath
@type {string} Ruta absoluta hasta la base del proyecto.

### scopes
@type {Array} Scopes o locaciones donde el framework buscará componentes Raptor.js, configurados a través de options.json o variables de entorno.

### externalDirectories
@type {Array} Ubicaciones compartidas configuradas vía variables de entorno.

Métodos
-----
### main()
`@param` {string} basepath ruta absuluta donde fue inicializado el proyecto.

Entrada principal del Core, inicializa Raptor.js, el inyector y configura el núcleo para su ejecución leyendo toda la configuración definida en options.json

### configure()
Configura el servicio web para su ejecución, se prepara el stack de express y sus middlewares.

### start()
Inicia el core de Raptor.js, teniendo en cuenta la configuración se inicia el servicio web y conexión de base de datos principal a través de sequelize.

### startServer()
Inicia el servicio web configurado para express, esta función es invocada por la función start del core. Tenga en cuenta que si en las opciones globales el atributo http se encuentra en false, este método no tendrá ningún efecto.

### addPublish()
`@param` {string} package Nombre del paquete dentro de node_modules que será publicado

`@param` {string} relative Ruta relativa dentro del paquete que será publicada

Expone el contenido del paquete especificado a través de express, será expuesto utilizando el prefijo de ruta `/public` y a continuación la ruta del propio paquete, es útil para añadir dinamicamente al registro de contenido público lo recursos js, css e imagenes de paquetes ubicados en node_modules.
``` javascript
/**
 * Expone el recurso de node_modules a la ruta:
 * localhost:4440/public/bootstrap/bootstrap.min.js
 */
R.addPublish("bootstrap","dist")
/**
 * Expone el recurso de node_modules a la ruta:
 * localhost:4440/public/jquery/jquery.min.js
 */
R.addPublish("jquery","dist")
R.addPublish("angular")
R.addPublish("angular-animate")
```
### addExternalComponents()
`@param` {string|Array} rutas Ubicaciones compartidas que deseamos añadir a la configuración

Añade ubicaciones compartidas al registro, el core buscará en estas ubicaciones componentes Raptor.js válidos.

### getExternalComponents()
@return {Array} Devuelve las ubicaciones compartidas configuradas.

### scanVendor()
`@param` {string} ruta Ruta hacia el vendor o scope que se desea escanear

Escanea un vendor o scope en busca de componentes Raptor.js válidos.

### addComponent()
`@param` {string} component Ruta del componnte

`@param` {boolean} validate Si se desea validar el componente

Añade el componente especificado al registro a partir de su ruta y opcionalmente si se desea validar


### registerComponent()
`@param` {string} comp nombre del componente

`@param` {string} vendor nombre del vendor

`@param` {boolean} validate determina si será validado por el gestor de componentes, dependencias hacia otros componentes

`@param` {string} external De ser especificado se configura el componente en modo externo y se ajusta su ruta absoluta

Registra un componente en el core de Raptor. La estructura física del componente debe estar creada al invocar esta función, es posible además registrar componentes en tiempo de ejecución. Opcionalmente se ejecutará una validación para este componente, revisando si las dependencias requeridas están completas.

### validateComponent()
`@param` {string} bundle nombre del componente

Valida el componente especificado, si las dependencias requeridas no están resueltas desactiva el componente.

### prepareComponent()
`@param` {string} bundle nombre del componente

Ejecuta la preparación del componente según las directivas del framework, en esta funcionalidad se leen los controladores y anotaciones.

### copyResources()
`@param` {string} bundle nombre del componente

`@param` {function} callback función a ejecutar luego de la rutina de copia

`@param` {boolean} preCompile precompilar los recursos copiados, se reconocen por defecto extjs

Utilitario para copiar los recursos de un componente hacia public/rmodules

### requireNode()
`@param` {string} name Ruta relativa al nombre del componente.

@return {Mixed}

Devuelve los recursos relativos al componente especificado, si no se especifica subruta entonces se devuelve la clase principal del componente.
``` javascript
R.requireNode("exampleNode/Lib/MyClass.js")
```

### resolveLocal()
`@param` {string} name ruta relativa al componente especificado

@return {string}

Devuelve la dirección absoluta del recurso especificado relativamente al componente

``` javascript
R.resolveLocal("exampleNode/Lib/MyClass.js")
```

### getSecurityManager()
`@param` {string} name nombre del SecurityManager

`@return` {SecurityManager}

Devuelve una nueva instancia de un SecurityManager con el nombre especificado o returna el existente.

### template()
`@param` {string} location ruta relativa al componente

`@param` {object} data Parámetros a pasar a la plantilla

`@return` {string}

Devuelve la plantilla ejs compilada perteneciente a un componente.

### lockNodemon()
Crea un archivo de bloqueo de nodemon, raptor-cli lo interpreta como una orden
para no reiniciar el servicio en modo de desarrollo hasta que se desbloquee.

### unlockNodemon()
Desbloquea nodemon en modo de desarrollo para que continúe su lógica.

### rewind()
`@param` {integer} Posición hasta donde se moverá el puntero en el stack de express

`@return` {Object} Objeto para invocar la función restore que implementa la adición de un nuevo middleware

Mueve el puntero del stack de express hasta la posición especificada e insertar los middlewares.

``` javascript
    R.rewind(15)
    .restore(()=>{
        //Insertar este middleware en la posición 15
        R.app.use(function(req, res, next){
            next()
        })
    })
```

Capítulo 12 – Annotation Framework 
===
Dentro de los componentes es posible especificar metadatos relacionados a las clases y funciones a través de anotaciones, un ejemplo de esto es la definición de rutas en los controladores a través de la anotación `@Route`, permitiendo una declaración elegante y limpia de este concepto. La lectura de declaración de anotaciones se realiza gracias al AnnotationFramework disponible desde el inyector de dependencias.

Para leer una anotación personalizada es necesaria la declaración de la clase que define dicha anotación. En esta clase es necesario establecer los posibles objetivos de esta anotación (DEFINITION, CONSTRUCTOR, PROPERTY, METHOD).
``` javascript
'use strict'
const Annotation = require('ecmas-annotations').Annotation;

class CustomAnnotation extends Annotation{
    /**
     * The possible targets
     *
     * (Annotation.DEFINITION, Annotation.CONSTRUCTOR, Annotation.PROPERTY, Annotation.METHOD)
     *
     * @type {Array}
     */
    static get targets() { return [Annotation.METHOD,Annotation.DEFINITION] }
    
    init(data) {
        this.annotation='CustomAnnotation'
    }
}
module.exports=CustomAnnotation;
```
Ejemplo de utilización de la anotación.
``` javascript
    /**
     * @CustomAnnotation("some value", sample="here is an attribute")
     */
    function MySample(){}
```
Para leer las anotaciones establecidas en las clases se invoca al AnnotationFramework para leer las definiciones, esta operación es realizada en la clase principal de los componentes.
``` javascript
configure(R, Events, AnnotationFramework, Annotations) {
	  // Registro de la anotación para que sea accesible
        AnnotationFramework
            .registry.registerAnnotation(require.resolve(__dirname + '/Annotation/CustomAnnotation'))

        Events
            .register({
                /**
                 * Evento para leer la Anotación cuando se
                 * inicialicen los Controladores
                 * 
                 */
                'init.controller': function (instance, controllerPath, bundle) {
                    var reader = new Annotations.Reader(AnnotationFramework.registry);

                    reader.parse(controllerPath);
                    //Leer las anotaciones de los métodos
                    reader.methodAnnotations.forEach((annotation) => {
                        if (annotation.annotation === 'CustomAnnotation') {
                            console.log(annotation.value, annotation.sample)
                        }
                    })
                    //Leer las anotaciones de la clase
                    reader.definitionAnnotations.forEach((annotation) => {
                        if (annotation.annotation === 'CustomAnnotation') {
                            console.log(annotation.value, annotation.sample)
                        }
                    })
                }
            })
    }

```
Auto Resolve
-----
La lista autoResolve contenida dentro del AnnotationFramework permite registrar Anotaciones objetivo en el momento de una resolución automática de una clase o archivo.

Raptor.js notifica mediante el evento `AutoResolveAnnotation` cuando está abriendo un archivo js dentro del proyecto por primera vez fruto de una instrucción `require`. El evento envía como primer argumento el Reader aprobado para esta lectura y que solo lee los nombres de anotaciones objetivo definidos en la lista AnnotationFramework.autoResolve, en la práctica permite procesar una anotación definida en la clase que estamos tratando de cargar vía `require` en el mismo instante en que se realiza la carga.

Esta característica fue agregada en versiones recientes 2.1.2 y está sugeta a mejoras.

Si queremos que nuestra anotación sea resuelta automaticamente primeramente debemos registrarla en el AnnotationFramework y luego añadir el nombre de la anotación a la lista AnnotationFramework.autoResolve
``` javascript

class Thanos{

    constructor(){

    }

    /**
     * @Deprecated
     */
    eliminarMundo(){
        console.log("Utilizare las gemas del universo")
    }
}
module.exports=Thanos;
```
``` javascript
configure(R, Events, AnnotationFramework, Annotations) {
	   // Registro de la anotación para que sea accesible
        AnnotationFramework
            .registry.registerAnnotation(require.resolve(__dirname + '/Annotation/Deprecated'))
        
        // Registrar el nombre de la anotacion para hacer un autoResolve, de lo contrario el Reader
        // aprobado en la auto resolucion no la procesa
        AnnotationFramework.autoResolve.push('Deprecated');


        Events
            .register({
                'AutoResolveAnnotation':$i.later(function(reader, file, loaded, AnnotationReaderCache){
                    
                    // En este ejemplo a todos los metodos de la clase marcados con la anotacion
                    // Deprecated lo sobrescribimos con un mensaje de advertencia
                    
                    var customs=AnnotationReaderCache.getMethods('Deprecated', file);
                    customs.forEach(element => {
                        if (loaded.prototype[element.target]) {
                            resolved.prototype[element.target] = function(){
                                console.log('Lo sentimos este metodo esta deprecated !!')
                            }
                        }

                    });
                    
                }),
                'ready':function(){
                    
                    // Invocamos la clase que queremos utilizar
                    
                    const Thanos=require('./Thanos')

                    var thanos=new Thanos();
                    thanos.eliminarMundo();
                }
            })
    }

```
build()
-----
`@param` {String} name Nombre de la anotación que queremos crear

`@param` {boolean} autoResolve Determina si las anotaciones son auto resueltas en el momento de la carga de la clase

`@return` {Object} Objeto que contiene el método `on`

Desde la versión 2.1.5 está disponible la función `build()` en el AnnotationFramework, permite la definición de anotaciones personalizadas de una manera sencilla sin pasar por la implementación propuesta anteriormente.

El ejemplo anterior ahora podemos re-definirlo y modificar el comportamiento de la función objetivo.

``` javascript

class Thanos{

    constructor(){

    }

    /**
     * @Deprecated
     */
    eliminarMundo(){
        console.log("Utilizare las gemas del universo")
    }
}
module.exports=Thanos;
```
``` javascript
configure(R, Events, AnnotationFramework, Annotations) {
	   
        // Construimos una Anotacion con nombre Deprecated, escuchamos el evento
        // de lectura de los metodos y modificamos el prototipo de 
        // la clase para ese metodo
        AnnotationFramework
			.build('Deprecated', true)
			.on('method', function (type, annotation, classDefinition) {

				if (classDefinition.prototype[annotation.target]) {
					classDefinition.prototype[annotation.target] = function () {
						console.log('Lo sentimos este metodo esta deprecated !!')
					}
				}

			})

        Events
            .register({
                'ready':function(){
                    
                    // Invocamos la clase que queremos utilizar
                    
                    const Thanos=require('./Thanos')

                    var thanos=new Thanos();
                    thanos.eliminarMundo();
                }
            })
    }

```
### on()
`@param` {String} event, Nombre del evento de lectura al que queremos suscribirnos, los valores posible son `method`, `definition`, `property`, `constructor` y `file`;

`@param` {Function} fn, Función a ejecutarse cuando se reciba el evento

El método on permite la suscripción a los diferentes eventos de lectura de la anotación creada, la descripción de los parámetros enviados por cada evento se lista a continuación.

### Event.method
`@param` {String} type, Tipo de evento lanzado en este caso method;

`@param` {Annotation} annotation, Instancia de la anotación leída que contiene la función objetivo (annotation.target) y los parámetros de la anotación.

`@param` {Mixed} classDefinition, Clase cargada por el AutoResolver, este parámetro solo es enviado si en el método `build` la anotación fue creada con autoResolve igual a true.

### Event.definition
`@param` {String} type, Tipo de evento lanzado en este caso definition;

`@param` {Annotation} annotation, Instancia de la anotación leída que contiene la función objetivo (annotation.target) y los parámetros de la anotación.

`@param` {Mixed} classDefinition, Clase cargada por el AutoResolver, este parámetro solo es enviado si en el método `build` la anotación fue creada con autoResolve igual a true.

### Event.property
`@param` {String} type, Tipo de evento lanzado en este caso property;

`@param` {Annotation} annotation, Instancia de la anotación leída que contiene la función objetivo (annotation.target) y los parámetros de la anotación.

`@param` {Mixed} classDefinition, Clase cargada por el AutoResolver, este parámetro solo es enviado si en el método `build` la anotación fue creada con autoResolve igual a true.


### Event.constructor
`@param` {String} type, Tipo de evento lanzado en este caso constructor;

`@param` {Annotation} annotation, Instancia de la anotación leída que contiene la función objetivo (annotation.target) y los parámetros de la anotación.

`@param` {Mixed} classDefinition, Clase cargada por el AutoResolver, este parámetro solo es enviado si en el método `build` la anotación fue creada con autoResolve igual a true.


### Event.file
`@param` {Object} meta, Objeto que contiene todas las anotaciones leídas para la clase auto resuelta;

`@param` {Reader} reader, Reader aprobado para la lectura de la anotación.

`@param` {String} file, Url absoluta a la clase auto resuelta.

`@param` {String} classDefinition, Clase cargada por el AutoResolver.

Este evento solo es lanzado si en el método `build` la anotación fue creada con autoResolve igual a true

Anotaciones
-----
Raptor.js proporciona un conjunto de anotaciones por defecto que pueden ser utilizadas para definir comportamientos adicionales en clases y métodos.

### @Route
`@param` {String} value, Ruta a definir para el método o la clase según este ubicada la anotación

`@param` {String} method, Método de escucha para esta ruta pueden ser `post`, `put`, `delete`, `get` y `all`, si no se especifica el framework utiliza el método `all`.

`@param` {Array} before, En este array se define las funciones que deseamos ejecutar antes que el método objetivo de la anotación.

`@param` {Array} after, En este array se define las funciones que deseamos ejecutar después del método objetivo de la anotación.

Automaticamente convierte el método objetivo de la anotación en un middleware de express que será pasado al enrutador y proporciona además los mecanismos para permitir la inyección de dependencias en el propio middleware.

Esta anotación permite la definición de una ruta en el marco de aplicación web Express, es el equivalente a crear con el enrutador de express directamente la ruta a través de express.all("/ruta"), express.get("/ruta") etc.

La anotación `@Route` solamente esta disponible en las clases controladoras ubicadas en el directorio `Controllers` de cada componente.

``` javascript
/**
 * @Route("/list")
 */
listAction(req, res, next){
    ...
}

/**
 * @Route("/create", method="post")
 */
createAction(req, res, next){
    ...
}

/**
 * @Route("/edit", method="put", before=[this.beforeAction])
 */
editAction(req, res, next){
    ...
}

/**
 * @Route("/delete", method="delete", after=[this.afterAction])
 */
deleteAction(req, res, next){
    ...
    next()
}

beforeAction(req, res, next){
    ...
}

afterAction(req, res, next){
    ...
}
```

Si la anotación es definida para la clase entonces se convierte en prefijo de ruta para las anotaciones `@Route` contenidas dentro de la clase.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{

    /**
     * @Route("/list")
     */
    listAction(req, res, next){
        ...
    }

    /**
     * @Route("/create", method="post")
     */
    createAction(req, res, next){
        ...
    }

    /**
     * @Route("/edit", method="put")
     */
    editAction(req, res, next){
        ...
    }

    /**
     * @Route("/delete", method="delete")
     */
    deleteAction(req, res, next){
        ...
        
    }

}
module.exports=User;
```
De forma especial podemos también declarar un prefijo de ruta para el componente en la clase principal de cada componente en el archivo index.js

### @Get
`@param` {String} value, Ruta o Subruta a definir para el método objetivo de esta anotación

Implementa una especificación de la anotación `@Route` para el método `Get`.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{

    /**
     * @Get("/list")
     */
    listAction(req, res, next){
        ...
    }


}
module.exports=User;
```

### @Post
`@param` {String} value, Ruta o Subruta a definir para el método objetivo de esta anotación

Implementa una especificación de la anotación `@Route` para el método `Post`.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{

    /**
     * @Post("/create")
     */
    createAction(req, res, next){
        ...
    }


}
module.exports=User;
```

### @Put
`@param` {String} value, Ruta o Subruta a definir para el método objetivo de esta anotación

Implementa una especificación de la anotación `@Route` para el método `Put`.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{

    /**
     * @Put("/edit/:id")
     */
    editAction(req, res, next){
        ...
    }


}
module.exports=User;
```

### @Delete
`@param` {String} value, Ruta o Subruta a definir para el método objetivo de esta anotación

Implementa una especificación de la anotación `@Route` para el método `Delete`.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{

    /**
     * @Delete("/list")
     */
    deleteAction(req, res, next){
        ...
    }


}
module.exports=User;
```

### @Controller
La anotación Controller marca una clase contenida en el directorio Controllers como controlador, sin esta marca la anotación @Route no tendrá efecto tampoco.

``` javascript
/**
 * @Route("/user")
 * @Controller
 */
class User{
```

### @Inyectable
`@deprecated` Será removida en próximas versiones en favor de @Injectable

La anotación Inyectable es una implementación de prueba, permite marcar cualquier método de cualquier clase ES6 para realizar inyección de dependencias desde el contenedor IoC. Gracias a la auto-resolución de clases podemos utilizar esta anotación e inyectar parámetros en el método objetivo de la anotación.

``` javascript

class Thanos{

    /**
     * @Inyectable
     */
    eliminarMundo(Options, Events){
        Events.register({
            ...
        })
    }
}

var th=new Thanos();
th.eliminarMundo();

```

### @Injectable
La anotación Injectable es la implementación estable de Inyectable que se encontraba en modo prueba,permite marcar cualquier método de cualquier clase ES6 para realizar inyección de dependencias desde el contenedor IoC. Gracias a la auto-resolución de clases podemos utilizar esta anotación e inyectar parámetros en el método objetivo de la anotación.

Fue incluida en la versión 2.1.5

``` javascript

class Thanos{

    /**
     * @Injectable
     */
    eliminarMundo(Options, Events){
        Events.register({
            ...
        })
    }
}

var th=new Thanos();
th.eliminarMundo();

```

### @Event
`@param` {String} nombre del evento a invocar

La anotación Event fue incluida en el core en la versión 2.1.5 y ahora ofrece una alternativa más elegante de invocar funciones de acuerdo a los eventos, incluso con la combinación con otra anotación como Inyectable.

``` javascript

class Thanos{

    /**
     * @Event("ready")
     * @Inyectable
     */
    start(Options){
        console.log("Nueva invocación -> Raptor.js ha iniciado en modo:",Options.mode)
    }

    configure(R, Events){
        Events.register({
            'ready':$i.later(function(Options){
                console.log("Invocación anterior -> Raptor.js ha iniciado en modo:",Options.mode)
            })
        })
    }
}
```
### @Cors

La anotación Cors es usada de conjunto con una anotación @Route activa para especificar que esa ruta puede ser accedida desde dominios cruzados.

``` javascript

    /**
     * @Route("/holaruta")
     * @Cors
     */
    indexAction(req, res, next){
        ...
    }

```

### @Csrf
La anotación Csrf es usada de conjunto con una anotación @Route activa para especificar que esa ruta debe ser filtrada del chequeo CSRF ya que Raptor.js para las peticiones de tipo post, put y delete realiza la validación del token csrf por defecto.

``` javascript

    /**
     * @Route("/holaruta",method="post")
     * @Csrf
     */
    indexAction(req, res, next){
        ...
    }

```

### @SessionFilter
La anotación SessionFilter es usada de conjunto con una anotación @Route activa para especificar que esa ruta debe ser filtrada de las creaciones de sesiones por el framework.

``` javascript

    /**
     * @Route("/holaruta")
     * @SessionFilter
     */
    indexAction(req, res, next){
        ...
    }

```

Capítulo 13 – Componentes Raptor.js 
===
Los componentes utilitarios de Raptor.js complementan el framework con funcionalidades encargadas de otorgar la abstracción necesaria en el proceso de desarrollo, la propuesta conceptual del proyecto Raptor para todas sus tecnologías incluyendo esta rama para Node.js incluye un panel de control de desarrollo (@raptorjs/raptor-panel), módulo de seguridad (@raptorjs/troodon), módulo de reconocimiento de usuario por patrón de tecleo o keystrokeDynamics (@raptorjs/bio) y un portal de usuario prediseñado (@raptor/ng-portal) utilizado además por @raptorjs/raptor-panel.

Cada uno de estos componentes puede ser activado y utilizado según se requiera debido a las características de nuestra aplicación.

raptor-panel(dev)
-----
El componente raptor-panel desde la versión 2.2.0 se separa del flujo de ejecución del proyecto que usted desarrolla, en las versiones anteriores el panel de control se integraba de conjunto en la ejecución del proyecto en modo de desarrollo por lo que podía ser invocado en la ruta `/raptor/home`. A partir de esta versión se separa y debe ser ejecutado a través del comando `rap panel` en caso de querer utilizarse, con este comando se levanta el panel de control en el puerto 4441 que se conecta automaticamente al proyecto en ejecución.

Esta separación tiene varias ventajas, una de ellas es que todas las herramientas de desarrollo del panel no se ven afectadas en caso de un error en el flujo de ejecución del proyecto en desarrollo. De forma general su funcionamiento sigue siendo el mismo, la única novedad es que en desarrollo ahora tenderemos nuestro proyecto corriendo en un puerto y si se desea utilizar las herramientas de desarrollo del panel de control pues entonces correrán en un puerto diferente en este caso el 4441.

Con el panel de control podemos modificar de forma visual las principales configuraciones del archivo options.json, generar componentes, controladores, interactuar con implentaciones visuales de las herramientas de desarrollo de componentes instalados.

Pantalla de inicio

<img style="width: 100%" src="./img/panel.png">

### Configuración
Son editadas algunas de las directivas más importantes, una vez configurado el servidor será reiniciado el proyecto actual en el puerto 4440  para ejecutar la nuevo configuración.

<img style="width: 100%" src="./img/panel-config.png">

### Generación de componentes
Es un proceso intuitivo donde indicaremos en el árbol la posición en donde queremos generar el componente o el controlador.

<img style="width: 100%" src="./img/panel-comp.png">

### Publicar recursos
Si deseamos publicar los recursos de nuestros componentes manualmente podemos hacerlo marcando en el árbol los componentes que deseamos y pulsamos en publicar.

<img style="width: 100%" src="./img/panel-publish.png">

### Perfilador
Este componente incluye además para el modo de desarrollo un perfilador minificado que aparece en la parte inferior derecha en cada página renderizada por el framework, permitiéndonos ver de forma visual parámetros como la sesión, tiempo de respuesta y el lenguaje activo.

Desde la versión 2.2.0 fue modificado el perfilador, las rutas detectadas ahora pueden ser visualizadas dentro del propio panel de control en la opción Rutas.

<img style="width: 100%" src="./img/panel-perfil1.png">

orm
-----
El componente orm encapsula la lógica de integración con Raptor.js del ORM Sequelize, uno de los paquetes más utilizados para la conexión con los motores relacionales de base de datos.

Por defecto este componente aparece desactivado, en caso de querer utilizarlo podemos activarlo mediante el comando `rap enable orm`, una vez activado podemos acceder en el panel de control para configurar la conexión del orm a la base de datos de forma visual y generar modelos.

También podemos establecer la configuración del orm de forma manual en el archivo options.json de nuestro proyecto con la siguiente configucación.

### Configuración
`database`: Esta configuración controla el orm sequelize utilizado por Raptor, establece la configuración de conexión con la base de datos. Inicialmente el estado de la conexión por defecto es off, para activar la conexión con la base de datos se deberán configurar los parámetros necesarios para establecer la conexión.

`database.state`: Estado de la conexión, acepta 2 valores on para activa,off para inactiva.

`database.options`: Set de opciones esperadas en la configuración de sequelize, está descrita en la api oficial de sequelize.

`database.options.port`: Puerto en el que escucha la base de datos.

`database.options.dialect`: Driver para conectarse al motor de base de datos, sequelize soporta mysql, postgres, tedius y otros más.

`database.options.host`: Dirección del motor de base de datos.

`database.user`: Usuario con el que se va a conectar en la base de datos.

`database.password`: Contraseña del usuario de conexión.

`database.name`: Nombre de la base de datos a la que se desea conectar.

``` json
{
  "database": {
    "state": "on",
    "options": {
      "port": 5433,
      "dialect": "postgres",
      "host": "127.0.0.1"
    },
    "api": true,
    "password": "postgres",
    "user": "postgres",
    "name": "nombre de la base de datos"
  },
  "port": 4440,
  "socketio": {
    "active": true
  },
  "language": {
    "default": "es",
    "usePrefered": false,
    "cookieName": "RaptorJSLang"
  },
  "secret": "Some secret",
  "proyectName": "RaptorJS",
  "maxEventListeners": "80"
}

```

ng-portal
-----
El componente ng-portal se encuentra activo por defecto una vez creado un proyecto Raptor.js, sirve como plantilla predefinida para crear un portal con AngularJS donde podemos añadir las funcionalidades de nuestra aplicación. Un ejemplo de implementación es el propio raptor-panel que utiliza a ng-portal para crear su interfaz.

Con ngPortal puedes crear una interfaz para tu aplicación en cuestión de minutos, entre los recursos que proporciona el portal ya se encuentra AngularJS y sus componentes principales, AngularMaterial, Bootstrap 4. Solo debemos enfocarnos en configurar y editar visualmente el portal que también brinda recursos de integración con troodon(Componente de seguridad) para proteger nuestra aplicación.

### ngPortal
Las clase ngPortal permite crear una instancia de un nuevo portal en una url, que podrá ser configurado con los viewPlugins definidos. Esta clase se encuentra disponible en el contenedor de dependencias IoC y puede ser inyectada en cualquier metodo haciendo uso del inyector de dependencias DI.

``` javascript
    //Creamos y configuramos un nuevo portal
    var portal=new ngPortal("miportal");
    portal.config(function(){
        this.viewPlugin('name','Nombre de la aplicación');
    })
```

### ngPortalRegistry
El ngPortalRegistry es un registro global de todos los portales creados en nuestro proyecto y cuando creamos una nueva instancia configurada de un ngPortal debemos registrarlo en este registro para que el portal tenga efecto en nuestra aplicación.

``` javascript
    //Creamos y configuramos un nuevo portal
    var portal=new ngPortal("miportal");
    portal.config(function(){
        this.viewPlugin('name','Nombre de la aplicación');
    })
    //registro del nuevo portal
    ngPortalRegistry.set(portal);
```


### Ejemplo
Para la creación del portal debemos escuchar el evento de adición al contenedor de dependencias(IoC) de la clase ngPortal, ya que no podemos invocar al inyector de dependencias con una clase que todavía no ha sido añadida al contenedor.

Podemos suscribirmos al evento ioc:ngPortal.ready en cualquiera de las 2 formas disponible, la primera a través de la anotación `@Event`. Notar que también marcamos al método como inyectable con la anotación @Injectable para hacer la resolución de dependencias.

``` javascript
class MiComponente{
    
    /**
     * @Event("ioc:ngPortal.ready")
     * @Injectable
     */
    crearPortal(ngPortal, ngPortalRegistry){
        //Creamos y configuramos un nuevo portal
        var portal=new ngPortal("miportal");
        portal.config(function(){
            this.viewPlugin('name','Nombre de la aplicación');
        })
        //registro del nuevo portal
        ngPortalRegistry.set(portal);
    }

}
```

En la forma natural de suscripcion de eventos a través del objeto Events en el configure del componente. 
``` javascript
class MiComponente{
    
   
    configure(R, Events){
        Events.register({
            'ioc:ngPortal.ready':$i.later(function(ngPortal, ngPortalRegistry){
                //Creamos y configuramos un nuevo portal
                var portal=new ngPortal("miportal");
                portal.config(function(){
                    this.viewPlugin('name','Nombre de la aplicación');
                })
                //registro del nuevo portal
                ngPortalRegistry.set(portal);
            })
        })
    }
}
```

### Puntos calientes
Los ViewPlugins es una de las funciones propuestas en el framework Raptor PHP 2 y que ahora son implementados para Raptor.js, permite la inyección de contenido en los hotpots declarados en el sistema para determinados patrones de ruta.

El entorno tiene 3 puntos principales de inyección de contenido, donde podrán definirse bloques personalizados con el contenido que deseamos logrando personalizar nuestro entorno para el objetivo deseado. 

`Punto 1`

Inserta contenido dentro del menu de opciones.

Nombre hotpot: `sidebar`

`Punto 2`

Inserta contenido dentro del panel superior, la inserción es realizada en el menu agrupado a la derecha.

Nombre hotpot: `navbar`

`Punto 3`

Inserta contenido dentro del cuerpo, la inserción es realizada fuera del area de la funcionalidad por lo que será visible en todas las funcionalidades cargadas en el area.

Nombre hotpot: `content`

`Punto 4 (cabecera)`

Inserta contenido dentro del head de la página, ideal para insertar estilos y javascript personalizados que queremos ejecutar antes de la carga de la página.

Nombre hotpot: `header`

`Punto 5 (script)`

Inserta contenido dentro de la sección de declaración javascript al final de la página, ideal para insertar otras bibliotecas javacript que deseemos o simplemente un script adicional.

Nombre hotpot: `script`

`Punto 6 (Pantalla de inicio)`

Inserta contenido dentro del area de la página de inicio, este hotpot reemplaza la guía inicial por la página de inicio de su opción.

Nombre hotpot: `start`

`Punto 7 (Icono de página)`

Reemplaza el icono por defecto del entorno, ustded deberá especificar solamente la url del icono.

Nombre hotpot: `icon`

`Punto 8 (Nombre de página)`

Reemplaza el nombre por defecto del entorno que aparece al lado del icono.

Nombre hotpot: `name`

`Punto 9 (Zona de script perfil de usuario)`

Inserta contenido dentro de la sección de declaración javascript en la página del perfil de usuario.

Nombre hotpot: `profile_script`

`Punto 10 (Zona header del perfil de usuario)`

Inserta contenido dentro del head de la página, ideal para insertar estilos y javascript personalizados que queremos ejecutar antes de la carga de la página.

`@Deprecated` En desuso, no tiene efecto en esta versión

Nombre hotpot: `profile_header`

`Punto 12`

Establece la ruta base de los iconos del menu.

Nombre hotpot: `sidebar_iconbase`

``` javascript
class MiComponente{
    
    /**
     * @Event("ioc:ngPortal.ready")
     * @Injectable
     */
    crearPortal(ngPortal, ngPortalRegistry){
        //Creamos y configuramos un nuevo portal
        var portal=new ngPortal("miportal");
        portal.config(function(){
            // Configuramos los puntos calientes para personalizar nuestro portal
            this
                .viewPlugin('start',this.template('MiComponenteNode:description.ejs'))
                .viewPlugin('name','Raptor.js')
                .viewPlugin('icon','/public/logo.png')
                .viewPlugin('header',this.template('MiComponenteNode:header.ejs'))
                .viewPlugin('sidebar',this.template('MiComponenteNode:sidebar.ejs'))
                // Desabilita la gestion del perfil de usuario
                .disableProfile()
                // Desabilita la carga de privilegios desde el modulo TroodonNode
                .disableSecurityMenu()
        
        })
        // Indica al portal que debera ser protegido por el modulo de seguridad
        .auth('MiComponenteNode:auth.ejs')
        //registro del nuevo portal
        ngPortalRegistry.set(portal);
    }

}
```

### Renderizando fragmentos
Las funcionalidades que usted desarrolla aparecerán en el area de contenido, pueden ser visualizadas de 2 formas, `embebidas` o `enmarcadas`.

Funcionalidades embebidas:

Este modo de renderizado significa que el contenido será inyectado dentro del área de contenido y estará en el mismo ámbito de variable que el portal. Las rutas de este tipo tendrán prefijo `!/e/` en el sistema de rutas de angular.

Funcionalidades enmarcadas:

Este modo de renderizado significa que el contenido será enmarcado en un iframe dentro del área de contenido, es utilizado sobre todo en tecnologías como Extjs y funciones que por alguna razón tienen poca combatibilidad con el ambiente. Las rutas de este tipo tendrán prefijo `!/f/` en el sistema de rutas de angular.

Si usted desea cargar una funcionalidad con ruta `/miruta/ejemplo` en el portal, solo deberá construir la ruta con el prefijo establecido para cada uno de los modos, para modo embebido `!/e/miruta/ejemplo` y para modo enmarcado `!/f/miruta/ejemplo`.

Ejemplo:`<a href="!/e/miruta/ejemplo" >`Cargar mi funcionalidad</a>

Seteando el modo en un portal protegido por seguridad:

Por defecto las funcionalidades serán renderizadas en modo enmarcado excepto que se especifique explicitamente lo contrario. Para especificar el modo embebido, la funcionalidad registrada en el módulo de seguridad deberá contener la clase `ngPortal-embedded` o simplemente `embed`. Cuando el portal se encuentra protegido, en el panel lateral aparecerán todas las funcionalidades que el usuario tiene permiso.

Para protejer el portal a través de seguridad se debe llamar la función `auth` en el configurador del portal y también es posible redefinir la gestión de seguridad reimplementando los procesos de autenticación, autorización y aditoría así como los métodos de logout y verificación de autenticación. 


``` javascript
class MiComponente{
    
    /**
     * @Event("ioc:ngPortal.ready")
     * @Injectable
     */
    crearPortal(ngPortal, ngPortalRegistry){
        //Creamos y configuramos un nuevo portal
        var portal=new ngPortal("miportal");
        portal.config(function(){
            // Configuramos los puntos calientes para personalizar nuestro portal
            this
                
                .viewPlugin('name','Raptor.js')
                
        })
        // Indica al portal que debera ser protegido por el modulo de seguridad
        .auth('MiComponenteNode:auth.ejs',function(autenticator){
            autenticator
                .setCondition(function(req,res,next){
                    
                    if(!req.session.mi_panel){
                        return true;
                    }else
                        return false;
                })
                .setAuthentication(function(req,username,password,done){
                    
                    if(username==R.options.panel.username && password==R.options.panel.password){
                        req.session.mi_panel={
                            username: username
                        }
                        
                    }else{
                        req.flash('panel_login_error','El usuario o la contraseña son inválidos')
                    }
                    req.session.save(function(){
                        req.res.redirect(req.url)
                    })	
                })
                .setAuthorization(function(req,res,next){
                    next()
                })
                .logout(function(req,res,next){
                    delete req.session.mi_panel;
                    req.session.save(function(){
                        res.redirect('/micomponente/home')
                    })
                })
        })
        //registro del nuevo portal
        ngPortalRegistry.set(portal);
    }

}
```
### Personalizando el ambiente
El ambiente es personalizado a través de hojas de estilo, debemos de utilizar el hotpot destinado para inyectar contenido dentro de la cabecera del entorno y comenzar a redefinir el estilo del mismo. El estilo aplicado en el portal, tendrá efecto en todas las funcionalidades renderizadas en modo embebido si se desea, ya que en este modo las funcionalidades son inyectadas directamente en el area de contenido y pertenecen al scope del entorno.

Para esto solo es necesario un par de conocimientos sobre CSS y la redefinición de las principales clases de Bootstrap que utiliza el entorno.
``` css
//Creamos nuestro archivo ( custom-css.css ) con la personalización del entorno
//este archivo lo definimos en Resources en el bundle que queramos
 
//Redefinimos la barra de cabecera de la siguiente forma(algo simple)
.ngPortal-nav{
    background: #999999
}
 
//Personalizacion del sidebar
.md-sidenav-left md-content{
    background-color: #464c53;
}
.md-sidenav-left .nav-link{
    color: white !important;
}
.md-sidenav-left a b{
    color: #bec0c1 !important;
}
 
//Personalizacion del indicador de carga de funcionalidades
//Color de la barra de carga
.portal-loading md-progress-linear .md-container{
    background-color: #bb818171 !important
}
.portal-loading md-progress-linear .md-bar{
    background-color: #911818 !important
}
//Color del fondo del mensaje
.portal-loading{
    background: rgba(0,0,0,.9);
}
//Color del texto del mensaje
.portal-loading .portal-loading-text{
    color:white
}
```

Creamos una plantilla haciendo referencia al css creado anteriormente

``` html
<link href="/public/example/MiComponenteNode/custom-css.css" rel="stylesheet">
```

Luego solo especificamos utilizando el hotpot `header` que nos coloque la plantilla `header.ejs` en la cabecera del portal.

``` javascript
class MiComponente{
    
    /**
     * @Event("ioc:ngPortal.ready")
     * @Injectable
     */
    crearPortal(ngPortal, ngPortalRegistry){
        //Creamos y configuramos un nuevo portal
        var portal=new ngPortal("miportal");
        portal.config(function(){
            // Configuramos los puntos calientes para personalizar nuestro portal
            this
                
                .viewPlugin('header',this.template('MiComponenteNode:header.ejs'))
                
        })
        
        ngPortalRegistry.set(portal);
    }

}
```

troodon
-----
La seguridad es el elemento más repetitivo e importante dentro de cualquier proceso de desarrollo, garantizar un cierto nivel de seguridad puede ser desde tedioso hasta complicado, todo en dependencia de cuán bueno se quiera ser, estadísticamente estos conceptos ocupan hasta el 40% del proceso de desarrollo.  
Si me preguntan, ahorrar 2 o 3 meses de desarrollo de estos elementos me parece genial, es parte de la abstracción y se sería un iluso en no considerarlo. Todas las maquinarias productivas de software del mundo se basan en esta abstracción, la seguridad solo se desarrolla una vez, luego queda como una plataforma actualizable y reutilizable para posteriores desarrollos.

Raptor incluye en su marco de seguridad un módulo (@raptorjs/troodon) encargado de implementar los procesos de identificación-autenticación, autorización y auditoria, garantizando una reducción considerable del tiempo que se invierte en la implementación de la seguridad. Garantiza además mediante la aplicación de estándares y modelos un nivel alto de seguridad.

Troodon implementa una extensión del modelo de control de acceso RBAC basado en estructuras jerárquicas, permitiéndole adaptarse a cualquier contexto organizacional. Esto añade una complejidad adicional al sistema, requiriendo la adaptación de la gestión de roles a un enfoque estructurado, concretamente realizar jerarquías de roles.

El RBAC jerárquico se basa en la perspectiva real de las estructuras organizacionales que existen en el mundo que nos rodea, donde las personas no solo cumplen un rol determinado sino que también pertenecen a diferentes niveles dentro de una estructura organizacional.

<img style="width: 100%" src="./img/troodon-tree.png">

Con esta aproximación es posible que 4 usuarios con igual rol, asignados a niveles de estructuras diferentes, tengan otra perspectiva de interacción con los activos del sistema. El modelado de una estructura organizacional toma forma de árbol, implementado bajo los basamentos de objetos recursivos expresados por Europio Engine.

El otro avance en este modelo es la expansión del concepto de privilegio. Digamos que en este concepto un privilegio podría ser administración de recursos, donde este podría tener varias acciones como `insertar`, `editar`, `eliminar` y `listar`, conocido también como CRUD. Así que la definición de privilegio incluye a su vez la creación de un nuevo concepto acciones. La definición de acción es mucho más granular, pudiendo ajustar para un determinado rol, ciertos privilegios, con ciertas acciones.

El modelo en general plantea un sistema de usuarios basados en estructuras, roles, privilegios y acciones, por lo que es posible aplicarlo en casi todos los contextos.

### Utilización del módulo de seguridad

El componente TroodonNode aparece desactivado por defecto dentro de los proyectos Raptor.js, para activar el componente debemos ir al manifiesto y cambiar el atributo state a true o simplemente ejecutar el comando de activación de un componente.

``` bash
rap enable troodon
```

Una vez activado el componente, ejecutará la migración con el objetivo de crear la estructura de tablas de base de datos necesaria para su funcionamiento. <i>Tener en cuenta que la implementación de este módulo está diseñada para motores relacionales de base de datos.</i>

Por defecto la instalación automática del componente registra un usuario admin con contraseña admin.

Las funcionalidades del módulo de seguridad para gestionar los conceptos podrán ser accedidas a través de las siguientes rutas:

`/troodon/user` Gestión de usuarios

`/troodon/rol` Gestión estructurada de roles

`/troodon/privilege` Gestión de privilegios

`/troodon/auditories` Gestión de trazas del sistema

`/troodon/structure` Gestión de estructuras

### Gestionando usuarios
Accediendo a la funcionalidad de gestión de usuarios encontraremos a la izquierda las estructuras, uno de los conceptos propuestos por el modelo de control de acceso. Inicialmente se mostrará solamente Raptor2 registrada por defecto, las estructuras son diseñadas en forma de árbol a las que le serán asociados los usuarios del sistema. Pulsando sobre Raptor2 se listaran los usuarios registrados en la que aparecerá el usuario por defecto admin.

<img style="width: 100%" src="./img/troodon-user.png">

En esta funcionalidad podremos adicionar, modificar y eliminar usuarios, por defecto los usuarios adicionados aparecerán en estado inactivo, para cambiar el estado se deberá pulsar en el indicador del estado donde se desplegará un menú donde podremos hacer el cambio de estado.

La opción de asignación de roles listará en una ventana los roles disponibles para asignar al usuario que deseemos, inicialmente en este listado no aparecerán roles disponibles debido a que el rol del usuario admin no tiene roles hijos definidos. La jerarquía de roles es un mecanismo para evitar la escalada de privilegios en este tipo de esquema basados en estructuras.

### Gestionando roles
La funcionalidad de gestión de roles permite adicionar, modificar y eliminar roles así como la asignación de privilegios a los roles creados.

Como característica los roles siempre tendrán un padre definido, esto significa que solo un usuario con el rol padre podrá asignar roles hijos a otro usuario evitando así la escalada de privilegios en la funcionalidad de gestión de usuarios.

Para crear un rol usted deberá marcar el padre del rol que intenta insertar, una vez creado usted podrá asignar los permisos del rol seleccionado pulsando sobre la opción privilegios.

<img style="width: 100%" src="./img/troodon-rol.png">

### Gestión de privilegios
La gestión de privilegios se encarga del registro de todas las funcionalidades desarrolladas en nuestra aplicación. Este concepto implica el entendimiento de la extensión del modelo tradicional de privilegio propuesto por el modelo CAEM (Control de Acceso para Escenarios Multientidad), donde ahora está determinado por la aparición del concepto acciones.

Para un privilegio clásico como Ej. gestionar persona ahora aparecen adicionalmente acciones `create`, `edit`, `delete`, `list` que definen el privilegio original. De esta forma un privilegio en el módulo de seguridad podrá aparecer en 3 categorías.

Un privilegio podrá ser:
`Contenedor`, actúa como contenedor de privilegios, podrá agrupar otros contenedores, índices y acciones, es identificado en la funcionalidad en forma de carpeta.

`Índice`, representa al privilegio tradicional, al índice le podrán ser asociadas las acciones.

`Acción`, las acciones serán el concepto más básico y granular del privilegio, siempre estarán asociadas algún índice.

<img style="width: 100%" src="./img/troodon-privilege.png">

Una vez añadido un índice, o sea una ruta que pertenece a una funcionalidad, entonces podemos añadir las acciones relacionadas a este índice. Si la ruta perteneciente al índice y las subrutas relacionadas a este índice ya se encuentran definidas en los controladores entonces el framework añadirá las acciones automáticamente, esto garantiza un proceso de registro automático del índice con sus acciones correspondiente.

### Protegiendo nuestra funcionalidad
Para proteger las funcionalidades de nuestra aplicación el modulo seguridad provee una anotación que puede ser definida en la clase principal del componente o en los propios controladores, indicándole el módulo de seguridad que se debe proteger un determinado patrón de ruta.
``` javascript
/**
* Raptor.js - Node framework
* 
* 
* @Troodon("/examples/*")
*/
class exampleNode {

```

La anotación `@Troodon` es la que se encarga de indicar al módulo de seguridad que se debe proteger la ruta especificada, en caso del ejemplo indica que se protejan todas las rutas que comiencen con `/examples/`. En esta anotación adicionalmente se puede especificar la plantilla de login que se quiere se renderice, el único requisito para esta plantilla es que para el formulario de login los campos de usuario y contraseña tengan name igual a `username` y `password` respectivamente.
``` javascript
/**
* Raptor.js - Node framework
* 
* 
* @Troodon("/examples/*",login="exampleNode:login.ejs")
*/
class exampleNode {
```

### Privilegios dinámicos
En la versión 2.1.3 fue incluido en el componente de seguridad los privilegios dinámicos, un concepto que permite la declaración de los privilegios en forma de anotaciones. 

En modo de desarrollo el componente trabaja con los privilegios declarados con las anotaciones @Privilege, realizando la asignación de estos al rol activo en tiempo de ejecución, esto significa que en modo de desarrollo usted no debe precuparse por registrar privilegios y acciones en el modulo de seguridad ni tampoco la asignación de permisos al rol, el sistema realiza este proceso automaticamente en memoria. La tabla security_privilege estará vacía todo el tiempo que se trabaje en el modo de desarrollo.

Una vez que se decide pasar a modo de producción usted puede utilizar el importador de privilegios para la tabla security_user y asignarlos automaticamente a un rol. La funcionalidad del importador está disponible tanto en el generador de artefactos como a través del comando `rap troodon-import`.

``` javascript
    /**
     * @Route("/miruta/example")
	 * @Privilege("Agrupador del menu->Ejemplo",class="")
     */
	indexAction(req,res,next){
		
		res.send("hola mundo controller");
	}
```
La anotación @Privilege deberá ser ubicada en una clase o action donde este presente la anotación @Route, en el valor de la anotación se establecerá el nombre con el que aparecerá en el gestor de privilegios, si usted desea crear agrupadores podrá indicarlo a través del indicador `->` donde en la parte izquierda del indicador corresponderá a los agrupadores(contenedor) y en la parte derecha del indicador el nombre del privilegio con el que aparecerá en el menú.

El atributo `class` corresponde al campo class name o nombre de clase del privilegio. En el ejemplo anterior se creará un privilegio con ruta `/miruta/example`, nombre de la funcionalidad `Ejemplo` dentro de un contenedor nombrado `Agrupador del menu`, además el nombre de clase se encuentra vacío.

### Autenticación api JSON Web Token
El componente de seguridad desde la versión 2.0.8 soporta la autenticación vía JSON WEB TOKEN (JWT), el token sirve como medio de autenticación ante todas las rutas protegidas del sistema. 

El token es obtenido en la ruta `/api/troodon/login` enviando una petición por el método `POST` con los parámetros `username` y `password`. La respuesta de la ruta será un objeto json con la siguiente forma.

``` javascript
{
    "accessToken":"HsOhh84hid8jkIjd.Kosos83kdkdspjdslls8JkdiJeiYj.i83jmd3jjoowk83jh"
}
```
En caso de que las credenciales `username` y `password` sean incorrectas el sistema enviará un código de respuesta `401`.

En el cliente el token puede ser almacenado en cualquiera de los recursos disponibles como el sessionStore o similar.
``` javascript
var token;
$.post('/api/troodon/login',{
    username:'admin',
    password: 'admin'
})
.done(function(response){
    token=response.accessToken;
    //Almacenar el token
})
```
Cada petición realizada a las rutas protegidas deberá contener en las cabeceras el JWT para que Raptor.js evalúe la credencial y autentique la petición. 

En el Header de la petición se especificará la cabecera `Authorization` de tipo Bearer y seguidamente el token obtenido previamente.

``` javascript

$.ajax({
    type:'GET',
    url:'/ruta/protegida',
    headers:{
        "Authorization":"Bearer "+token
    },
    success:function(data){
        
    }
})
```


### Importando privilegios
Para pasar a modo producción usted primeramente tendrá que importar los privilegios dinámicos hacia el esquema real de base de datos. Esto puede realizarse de forma muy sencilla en 2 formas.

`Comando troodon-import`

Este comando está disponible desde la consola y puede invocarse en desarrollo para crear el esquema real de privilegios en BD, solo necesita 1 argumento correspondiente al nombre de rol existente en BD que le serán asignados los privilegios al insertarlos.
``` batch
>rap troodon-import "Raptor admin"
```
Una vez ejecutado el comando puedes correr el proyecto en modo de producción trabajando con los privilegios físicos en BD.

`Vía generador de Artefactos`

En el generador de artefactos disponible en el panel de control encontrarás en el menú la tecnología troodon, solo debes seleccionarla, al listarse las acciones encontrarás la acción de importado, solo pulsamos en importar, se levantará una ventana requiriendo el campo Rol que se utilizará para asignar los privilegios.

<img style="width: 100%" src="./img/troodon-import1.png">

<img style="width: 100%" src="./img/troodon-import2.png">

### Servicio de datos
El componente Troodon incluye en el contenedor de dependencias(IoC) un servicio de datos con el nombre `TroodonDataService` encargado de proveer algunos datos relacionados con el componente de seguridad, con la evolución del componente se irán agregando otros servicios.

Las funciones disponibles desde la versión 2.1.5 se listan a continuación:

`getPrivilegesTree()`

`@param` {Array} roles, un array con los id de los roles

`@return` {Promise} Promesa con los privilegios según los roles especificados

Devuelve una Promesa con todos los privilegios según los id de los roles especificados, esta función hace una mezcla de todos los privilegios detectando el modo en que se encuentra el sistema, si se encuentra en desarrollo devuelve los privilegios dinámicos creados, si se encuentra en producción devuelve los privilegios registrados o importados en la gestión de privilegios.

``` javascript
    /**
     * @Route("/someroute")
     */
    getUserPrivilege(req, res, next, TroodonDataService){
        TroodonDataService
            // En el req.user.idRol se encuentra un array
            // con los roles del usuario autenticado
            .getPrivilegesTree(req.user.idRol)
            .then(function(privileges){
                res.json(privileges)
            })
            .catch(function(err){
                next(err)
            })
    }

    /**
     * @Injectable
     */
    getUserPrivilegeInOtherMethod(TroodonDataService){
        TroodonDataService
            // Pasar un array de id de roles
            .getPrivilegesTree([1,5])
            .then(function(privileges){
                //Hacer algo con los privilegios
            })
            .catch(function(err){
                
            })
    }
```

`getStructureChildren()`

`@param` {Integer} id, El id de la esctructura padre

`@return` {Promise} Promesa con los hijos de la estructura especificada

Devuelve una Promesa con todos los hijos según el id de la estructura especificada, esta función hace una busqueda recursiva del árbol de estructuras desde el id especificado hasta el último hijo del árbol.

``` javascript
    /**
     * @Route("/someroute")
     */
    getAllTree(req, res, next, TroodonDataService){
        TroodonDataService
            // En el req.user.idStructure se encuentra el id
            // de estructura del usuario autenticado
            .getStructureChildren(req.user.idStructure)
            .then(function(tree){
                res.json(tree)
            })
            .catch(function(err){
                next(err)
            })
    }

    /**
     * @Injectable
     */
    getTreeInOtherMethod(TroodonDataService){
        TroodonDataService
            // Pasar id de estructura, 0 para la base del árbol
            .getPrivilegesTree(0)
            .then(function(tree){
                //Hacer algo con el árbol
            })
            .catch(function(err){
                
            })
    }
```

`getRolChildren()`

`@param` {Integer} id, El id del rol padre

`@return` {Promise} Promesa con los hijos del rol especificado

Devuelve una Promesa con todos los hijos según el id de rol especificado, esta función hace una busqueda recursiva del árbol de roles desde el id especificado hasta el último hijo del árbol.

``` javascript
    /**
     * @Route("/someroute")
     */
    getAllTree(req, res, next, TroodonDataService){
        TroodonDataService
            // En el req.user.idRol se encuentra un array
            // con los roles del usuario autenticado, pasamos
            // solo el primero
            .getRolChildren(req.user.idRol[0])
            .then(function(tree){
                res.json(tree)
            })
            .catch(function(err){
                next(err)
            })
    }

    /**
     * @Injectable
     */
    getTreeInOtherMethod(TroodonDataService){
        TroodonDataService
            // Pasar id de rol
            .getRolChildren(4)
            .then(function(tree){
                //Hacer algo con el árbol
            })
            .catch(function(err){
                
            })
    }
```

bio
-----
El componente @raptorjs/bio (módulo de reconocimiento biométrico) aparece como un complemento de seguridad reforzando el proceso de autenticación. Se encarga de la validación de la identidad del usuario que está intentando acceder al sistema. Este tipo de tecnología es conocida como Keystroke Dynamics y se basa en el reconocimiento del patrón de tecleo del usuario al escribir su contraseña. Múltiples investigaciones realizadas en este campo refieren el carácter identitario de las características de tecleo de una persona, clasificado como características biométricas.

El proyecto Raptor lanza su utilización a partir de la investigación realizada en el año 2017 que incluyó un reto en línea donde se entregaban las credenciales de administración del sistema. Hasta el día de hoy nadie ha podido acceder aun conociendo las credenciales de administración.

En esta versión el módulo de BioNode rompe su dependencia con el componente de seguridad TroodonNode y ya puede ser utilizado para proteger cualquier ventana de login, incluyendo el propio panel de control. A partir de las versiones superiores a la 2.0.5 es posible la utilización del componente a través de la anotación Biometry donde se especifica el funcionamiento.
### API
En la clase principal del componente se especifica en la cabecera de la clase la anotación de la siguiente forma
``` javascript
/**
 * TroodonNode - Componente de seguridad
 * 
 * @Biometry({
 *  bioSession:"bioTroodon",
 *  frontLogin: "/troodon/*",
 *  getActiveUser: this.getActiveUser,
 *  prototype:"troodon"
 * })
 */
class TroodonNode {

    getActiveUser(req, res, done) {
        done(req.user.username)
    }
```
La anotación Biometry espera por parámetro un objeto de configuración con los siguientes atributos, alguno de estos serán obligatorios.

`bioSession`: El nombre de la sesión que contendrá los datos biométricos (obligatorio).

`frontLogin`: Este atributo contiene la ruta que se protegerá biométricamente, coincide con la ruta especificada en el enrutador (obligatorio).

`getActiveUser`: Esta función se le pasan por parámetro el request, response y una función a ejecutar pasándole por parámetro el usuario resuelto (generalmente desde la sesión) del proceso de autenticación (obligatorio).

`init`: Este atributo es opcional, es una función que se invoca una vez ejecutado el middleware, es utilizada generalmente para la redefinición del logout.

`prototype`: Nombre del prototipo a definir o utilizar por esta configuración biométrica, si el nombre ya ha sido definido entonces se utiliza esa configuración, en caso de no existir se define un nuevo prototipo con la configuración establecida en la actual.

Usted debe tener en cuenta que una vez logueado biométricamente se debe reimplementar la lógica para cerrar la sesión ejecutando la función de logout original así como la destrucción de la sesión biométrica, en el método init se encuentra accesible la función this.logout para dar soporte a esta lógica.

template-gen(dev)
-----
Los `artefactos` es uno de los nuevos conceptos propuestos para la versión 2.0.7, se basa en la creación de conceptos relacionados al proyecto y que son conocidos como artefactos. La lógica de esto está implementada en el componente @raptorjs/template-gen que puede ser encontrado en una de las ubicaciones compartidas de desarrollo.

En este componente encontraremos utilitarios para la creación de controladores, api, interfaces visuales para cada una de las tecnologías, comandos, compresores,  etc.

Tiene como particularidad que pueden ser definidas otras tareas y tecnologías a través de la importación de componentes que implementen las acciones.

<img style="width: 100%" src="./img/template-gen1.png">

Para crear un artefacto solo debemos seleccionar el componente donde se creará, elegir la tecnología y seleccionar en el listado de acciones pinchando sobre el botón crear.

Algunas de las acciones definidas requerirán datos adicionales para completar la acción.

<img style="width: 100%" src="./img/template-gen2.png">

extjs-designer(dev)
-----
Este componente es un utilitario de desarrollo que aparece para la versión 2.0.7, complementa la creación de artefactos relacionados a la tecnología Extjs que aparece por defecto en el generador de artefactos.

Fue importado desde Raptor Studio (Descontinuado) y ahora puede ser utilizado en Raptor.js para el diseño visual de interfaces paraExtjs. Aunque el componente se encuentra en beta resulta de mucha utilidad por la rapidez en la que se pueden definir los componentes visuales de nuestra aplicación Extjs.

<img style="width: 100%" src="./img/extjs-designer1.png">

Pulsando sobre el botón abrir en el Diseñador de interfaces para Extjs podemos ver todos los directorios Resources de cada componente donde estará nuestra aplicación Extjs. Para poder cargar una edición de interfaz debemos anteriormente haber creado un Esqueleto de proyecto para aplicación Extjs en algún componente dentro de nuestro proyecto.

<img style="width: 100%" src="./img/extjs-designer2.png">

<img style="width: 100%" src="./img/extjs-designer3.png">


Proyecto Raptor
====
Raptor.js
----------------

© 2014, 2019, Proyecto Raptor Cuba [MIT 
License](http://www.opensource.org/licenses/mit-license.php).

**Raptor.js** es mantenido por el [Proyecto Raptor](http://raptorweb.cubava.cu) con ayuda de los contribuidores.

 * [Proyecto Raptor](http://raptorweb.cubava.cu) (raptor.cubava.cu)
 * [Github](http://github.com/williamamed) (@williamamed)
 * [Facebook](http://facebook.com/raptorwebcuba) (@proyectoraptor)

 

[dist]: https://github.com/williamamed/Raptor.js
