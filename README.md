# Raptor.js
Node Full Stack Web Framework

Raptor.js es un framework web full stack basado en Node.js, utiliza como core el microframework express de conjunto con otros módulos utilitarios del repositorio npm que permiten el desarrollo de aplicaciónes web de forma ágil.

El proyecto propone una arquitectura basada en componentes, donde las responsabilidades de la lógica de nuestra aplicación se encuentra encapsulada dentro de componentes.

La solución incluye un marco de abstracción de seguridad integrado en un módulo (TroodonNode) que garantiza la implementación de los procesos de identificación-autenticación, autorización y auditoría. Implementa un extensión de los modelos de control de acceso RBAC y CAEM.
Además cuenta con un módulo de reconocimiento biométrico por dinámica de tecleo (BioNode), que se inserta dentro del poceso de identificación-autenticación del módulo de seguridad.

# Puesta en funcionamiento
Descargue las fuentes, descomprima utilizando 7zip.

Abra el terminal en el directorio del proyecto y tecle npm start, una vez arrancado el proyecto puede abrir la url http://localhost:4440, el sistema redireccionará hacia el panel de control de Raptor.js donde podrás configurar, crear componentes y mapear modelos de base de datos hacia el proyecto.
