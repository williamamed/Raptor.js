Raptor.js - 2
=======
<img style="float: right;margin-top: -70px" src="/public/@raptorjs/core/img/raptorjs-full.png" height="90">

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
Al instalar globalmente el paquete cli a través de flag -g tendremos accesibles en nuestro equipo el comando raptor-cli.

En modo de desarrollo podremos conectar nuestro dispositivo y correr nuestra app
a través del comando `raptor-droid run`. (Recuerde habilitar el modo de desarrollo en su dispositivo)


### Comandos

Una vez instalado el cli podemos usar los comandos disponibles para crear y correr nuestro proyecto.

`create <nombre>`: El comando create crea un nuevo proyecto en el directorio actual con la estructura de la arquitectura propuesta por raptor, adicionalmente crea el package.json e instala las dependencias básicas (node_modules) del proyecto. Desde la versión 2.1.0 fue removida la opción install-offline.

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

`dev [import | delete]`: Importa o elimina un componente del área de desarrollo (cli.development).

``` batch
> rap dev import C:\\Path\\uncomponente.zip

> rap dev import http://raptorweb.cubava.cu/uncomponente.zip

> rap dev delete uncomponente

```

`install <agrupador> <zipFile|URL> `: Instala el componente especificado en formato zip en el proyecto actual.

``` batch
> rap install Util C:\\Path\\uncomponente.zip

> rap install Util http://raptorweb.cubava.cu/uncomponente.zip

```


Capítulo 2 – Arquitectura de Raptor.js
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

`database`: Esta configuración controla el orm sequelize utilizado por Raptor, establece la configuración de conexión con la base de datos. Inicialmente el estado de la conexión por defecto es off, para activar la conexión con la base de datos se deberán configurar los parámetros necesarios para establecer la conexión.

`database.state`: Estado de la conexión, acepta 2 valores on para activa,off para inactiva.

`database.options`: Set de opciones esperadas en la configuración de sequelize, está descrita en la api oficial de sequelize.

`database.options.port`: Puerto en el que escucha la base de datos.

`database.options.dialect`: Driver para conectarse al motor de base de datos, sequelize soporta mysql, postgres, tedius y otros más.

`database.options.host`: Dirección del motor de base de datos.

`database.user`: Usuario con el que se va a conectar en la base de datos.

`database.password`: Contraseña del usuario de conexión.

`database.name`: Nombre de la base de datos a la que se desea conectar.

`port`: Puerto en el que estará escuchando el servidor web, por defecto Raptor propone el 4440.

`socketio`: Tecnología de conexión bidireccional por socket, establece el objeto de configuración del socket de conexión.

`socketio.active`: Establece si socketio estará activo o no, espera como valor un booleano.

`language`: Objeto de configuración del lenguaje, es usado por Raptor para configurar el idioma por defecto.

`language.default`: Lenguaje por defecto, se especifica la abreviatura del lenguaje a utilizar, ejemplo “es”.

`language.usePrefered`: Determina si Raptor deberá darle prioridad a la directiva enviada por el navegador de lenguaje de preferencia, espera como valor un booleano.

`language.cookieName`: Nombre de la cookie de lenguaje.

`panel`: Objeto de configuración que establece las directivas del panel de control visual de Raptor.

`panel.secure`: Establece si el panel de control estará protegido por contraseña, espera un booleano. Generalmente esta configuración nunca es editada manualmente, es realizada a través del propio panel.
panel.username: Este valor es obligatorio solo cuando panel.secure sea true, establece el nombre de usuario a utilizar en el panel de control.

`panel.password`: Contraseña del usuario configurado para el panel de control.

`secret`: Llave secreta generada, es utilizada en el framework como semilla para los procesos de cifrado y configuración de sesiones.

`proyectName`: Nombre del proyecto, generalmente es establecido en el propio panel.

`http`: (Opcional, Modo de desarrollo) Array con los patrones de archivos a ignorar por raptor-cli (nodemon).

`scopes`: (Opcional) Array con los nombres de los scopes, indica al framework que debe leer cada uno de estos scope en node_modules en busca de nuevos componentes Raptor.js, es útil cuando instalamos un componente Raptor.js a través del npm y es ubicado en el directorio node_modules, Raptor lee por defecto el scope @raptorjs donde están ubicados los componentes del core del framework.

`publish`: (Opcional) Objeto con los nombres de las tecnologías ubicadas en node_modules que queremos exponer a través de express en el directorio public del framework, pueden ser bootstrap, angularjs etc.

`maxEventListeneres`: Límite máximo de subscripciones a eventos que el core de Raptor.js soportará, por defecto el valor aparece en 80.


``` json
{
  "mode": "development",
  "database": {
    "state": "on",
    "options": {
      "port": 3306,
      "dialect": "mysql",
      "host": "127.0.0.1"
    },
    "api": true,
    "password": "root",
    "user": "root",
    "name": "raptorjs"
  },
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

Ubicaciones compartidas (Nuevo)
-----
A partir de la versión 2.0.7 el framework soporta las ubicaciones compartidas, tanto para ambientes de desarrollo como de producción. En principio la ubicación principal de un componente será el directorio src del propio proyecto en ejecución, además podrán ser configuradas otras locaciones donde se encontrarán componentes de uso común para otros proyectos.

### Ubicaciones de desarrollo

Como particularidad en modo de desarrollo se añaden otras 2 locaciones que siempre estarán disponibles cada vez que se ejecute el proyecto a través de raptor-cli. Estas locaciones de modo de desarrollo pueden ser encontradas en:

`$USER_DOCUMENTS/raptor.cli.dev/cli.development`

`$NPM_GLOBAL/node_modules/raptor-cli/node_modules/@raptorjs`

Su función es contener componentes usados solamente en desarrollo y que representan utilitarios comunes que son utilizados en cada uno de los proyectos.

<img style="width: 100%" src="/public/@raptorjs/apidoc/img/share.png" >

En el diagrama anterior los componentes pueden ser identificados como los rectángulos verdes asociados a los proyectos o en el cli asociados a un agrupador cli.development.

Los componentes de desarrollo estarán contenidos en un agrupador llamado cli.development tanto en la primera locación como en la segunda locación de desarrollo.

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
 */
class MiControlador extends R.Controller {

    configure() {

    }

    /**
     *  
     *  @Route("/holaruta",method="all")
     * 
     */
    holaRuta(req, res, next) {
        res.send('hola ruta')
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
    * @param Raptor R instancia de la aplicacion Raptor
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
Los controladores son clases definidas dentro del directorio Controllers, encargados de la descripción de la interacción entre la capa de presentación (Frontend) y la capa de negocio (Backend). Estas clases heredan de Controller y en ellas pueden ser definidos metadatos en forma de anotaciones que lo vinculan con el enrutador (@Route), pudiendo en ellas definirse respuestas a determinados patrones de ruta o sea peticiones hechas a través de un cliente http.
``` javascript
'use strict';

/**
 * prefijo de ruta todas las definiciones en el controlador
 * 
 * @Route("/example") 
 */
class MiControlador extends R.Controller {

    configure() {

    }

    /**
     *  
     *  @Route("/holaruta",method="all")
     * 
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
     *  @Route("/holaruta",method="all")
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

Dependencias
-----

### sequelize
Instancia creada de la conexión activa con la base de datos configurada por Raptor, aunque esta es la conexión activa principal se pueden crear otras instancias y registrarlas en el contenedor de dependencias.

### queryInterface
Referencia al queryInterface de la instancia principal de sequelize activa.

### Op
Objeto que contiene los operadores utilizados en las consultas en sequelize, like, or, and, not etc.., en las últimas versiones del ORM es la forma recomendaba de establecer los operadores en las consultas.

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
### Migration
Objeto que contiene métodos utilitarios de las funcionalidades de migración, Ej. reIndex para reindexar las sequencias en esquemas postgres y Oracle.
### Umzug
Gestor de migraciones.
### DefaultSession
Contiene un valor booleano que define si se utilizara la sesión por defecto configurada por Raptor.js, es posible manipular este valor para definir un manejador de sesión nuevo.
### nombre-de-componente_nombre-de-modelo
Raptor.js registra además en el contendor las referencias a los modelos sequelize definidos en los componentes instalados. La forma de acceder a ellos mediante el inyector es: nombre del componente sin el sufijo bundle donde está ubicado el modelo, seguido de un guión bajo y luego el nombre del modelo, ejemplo Troodon_security_users, esto se refiere que inyectaremos el modelo security_users que se encuentra en el componente TroodonNode.

Otras dependencias
-----
### ngPortal
Definición de la clase ngPortal del componente ngPortalNode, se utiliza para configurar un portal.
### ngPortalRegistry
Registro de instancias de portales creados con ngPortal.
### Bio
Objeto registrado por el componente biométrico para la protección con patrón de tecleo de determinadas rutas, a través del método protection devuelve un middleware que será utilizado para controlar el acceso en diferentes rutas.

$injector API
-----
### $injector
@param {string} Llave nombre de la dependencia.

@param {string} value Valor a registrar en la dependencia especificada.

@return null | mixed

Esta función es utilizada tanto para registrar como para obtener las dependencias, si no se especifica el valor entonces el inyector tratará de devolver la dependencia con la llave especificada, si se especifica el valor el inyector registrara la dependencia especificada.

``` javascript
//set
$injector("myObject",{message:"Hi"})
//get
$injector("myObject")
```
### invoke
@param {Function} funcion Función a invocar utilizando el inyector.

@return null | mixed

Ejecuta en el momento la función especificada por parámetro, el DI tratará de inyectar las dependencias especificadas por parámetros en dicha función, devolverá el valor retornado por la función especificada por parámetro.
``` javascript
$injector.invoke(function(sequelize){
    console.log(sequelize)
})
```
### invokeLater
@param {Function} funcion Función a invocar utilizando el inyector.

@return Function

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
La suscripción a determinados eventos es realizada generalmente en el método configure de la clase principal index del componente, ya que nos suscribimos a estos eventos antes de que sean lanzados por el framework producto a que el método configure es una de las primeras rutinas invocadas por Raptor.js. 

Debemos tener en cuenta que la suscripción deberá realizarse antes del lanzamiento de cualquier evento de lo contrario nuestra suscripción nunca será invocada.

A continuación se describen los eventos generados por el framework.

Eventos
-----
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
### session:config 
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
Evento lanzado luego que es configurado el middleware de helmet, recibe como parámetro la definición de helmet importada por Raptor, puede ser utilizada para configurar otros parámetros adicionales. Consultar la documentación de helmet
### before:middleware 
Evento lanzado antes que se ejecute el método middleware de la clase principal index de cada componente.
### run:middlewares 
Evento lanzado para invocar la ejecución del método middleware de la clase principal de cada componente.
### after:middleware 
Evento lanzado después que se ejecute el método middleware de la clase principal index de cada componente.
### before:prepare 
Evento lanzado antes que se ejecute la preparación del componente, la lectura de los controladores, ejecución del configure de cada controller, lectura de anotación de rutas, configuración de rutas, compressor.
### run:prepare 
Evento que invoca la preparación de los componentes.
### afer:prepare 
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
### database:failed 
Evento lanzado cuando ocurrió un error en la conexión de base de datos principal configurada por Raptor.
ready Evento lanzado cuando core ha terminado la configuración y se encuentra listo , tenga en cuenta que es posible que el servidor http o la conexión con base de datos pudieran estar desactivadas.
### before:config 
Este evento es lanzado antes de la lectura y configuración de los componentes, o sea antes que sean invocados los configure de cada clase principal de los componentes.
### after:configure 
Este evento es lanzado cuando se ha terminado de ejecutar todos los configure de cada clase principal de los componentes así como su validación por el framework.
### before:invoke.configure 
Evento lanzado antes que se ejecute el método configure de la clase principal del componente, recibe como parámetro el componente actual.
### before:[nombre-componente].configure 
Evento lanzado antes que se ejecute el método configure de la clase principal del componente especificado, recibe como parámetro el componente actual.
### after:[nombre-componente].configure 
Evento lanzado después que se ejecute el método configure de la clase principal del componente especificado, recibe como parámetro el componente actual.
### after:invoke.configure 
Evento lanzado después que se ejecute el método configure de la clase principal del componente, recibe como parámetro el componente actual.
### before:invoke.middleware 
Evento lanzado antes que se ejecute el método middleware de la clase principal del componente, recibe como parámetro el componente actual.
### before:[nombre-componente].middleware 
Evento lanzado antes que se ejecute el método middleware de la clase principal del componente especificado, recibe como parámetro el componente actual.
### after:[nombre-componente].middleware 
Evento lanzado después que se ejecute el método middleware de la clase principal del componente especificado, recibe como parámetro el componente actual.
### after:invoke.middleware 
Evento lanzado después que se ejecute el método middleware de la clase principal del componente, recibe como parámetro el componente actual.
### before:prepare.controller 
Evento lanzado antes que se lean y configuren los controladores de un componente, recibe como parámetro el componente actual.
### init:[nombre-componente].[nombre-controlador] 
Evento lanzado cuando se inicializa el controlador y componente especificado, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
``` javascript
Events.register({
    'init:RaptorNode.PanelController':function(controller,ruta,componente){
        
    }
})
```
### init:controller 
Evento lanzado cuando se inicializa el controlador de un componente, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
``` javascript
Events.register({
    'init:controller':function(controller,ruta,componente){
        
    }
})
```

### config:[nombre-componente].[nombre-controlador] 
Evento lanzado después que es ejecutado el método configure del controlador y componente especificado, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
### config:controller 
Evento lanzado después que es ejecutado el método configure de cada controlador, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
### routes:[nombre-componente].[nombre-controlador]
Evento lanzado después que es configurada las rutas del controlador y componente especificado, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
### routes:controller 
Evento lanzado después que es configurada las rutas década controlador, recibe como parámetro la instancia del controlador, ruta absoluta y objeto de configuración del componente.
### after:prepare.controller 
Evento lanzado después que son leídos y configurados los controladores de un componente, recibe como parámetro el componente actual.
### ioc:[nombre-dependencia].ready 
Evento lanzado cuando el nombre de dependencia especificada ha sido añadida al inyector de dependencias y está listo para consumirse, recibe como parámetro la dependencia recién añadida.
### migration:ready 
Evento lanzado cuando las migraciones están lista para su ejecución, solo le lanzará cuando exista una conexión exitosa con alguno de los motores de base de datos.
### annotation:read.definition.[ClassName] 
Evento lanzado cuando las anotaciones de la clase ClassName fueron leídas, recibe como parámetro el tipo de anotación que se leyó (definition) y la definición de la anotación recién leída.
### annotation:read.method.[ClassName] 
Evento lanzado cuando las anotaciones de los métodos de la clase ClassName fueron leídas, recibe como parámetro el tipo de anotación que se leyó (method) y la definición de la anotación recién leída.

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
