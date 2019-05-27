# Raptor.js 2
Node Full Stack Web Framework

Raptor.js es un framework web full stack basado en Node.js, utiliza como core el microframework 
express de conjunto con otros módulos utilitarios del repositorio npm que permiten el desarrollo de aplicaciones web de forma ágil.

El proyecto propone una arquitectura basada en componentes, donde las responsabilidades de la lógica de nuestra 
aplicación se encuentran encapsuladas dentro de componentes.

La solución incluye un marco de abstracción de seguridad integrado en un módulo (TroodonNode) que garantiza la implementación 
de los procesos de identificación-autenticación, autorización y auditoría. Implementa una extensión de los modelos de control de 
acceso RBAC y CAEM. Además cuenta con un módulo de reconocimiento biométrico por dinámica de tecleo (BioNode), que se inserta 
dentro del proceso de identificación-autenticación del módulo de seguridad.

## Documentación oficial

Documentación y api de [Raptor.js](http://raptorweb.cubava.cu/documentacion-raptor-js/).
Bolg oficial del [Proyecto Raptor](http://raptorweb.cubava.cu).

## Arquitectura de Raptor.js

Las responsabilidades de la lógica de nuestra aplicación se encuentran encapsuladas dentro de componentes, cada componente es ubicado dentro de directorios conocidos como agrupadores o vendors encontrados en la raíz del directorio src.
Además del directorio src encontrarás los siguientes directorios:

config: Contiene el archivo options.json con la configuración global del framework.

public: Directorio de recursos web, se encuentran las bibliotecas utilizadas del lado del cliente, bootstrap, extjs, angular.js, socket.io y el directorio rmodules que contiene los recursos web de los componentes en src (son copiados por el cli automáticamente en modo de desarrollo).

src: Fuentes de nuestra aplicación en forma de componentes reutilizables, los componentes son reconocidos por el sufijo Node, ejemplo exampleNode.

node_modules: Directorio de dependencias de paquetes utilizados por el framework.



