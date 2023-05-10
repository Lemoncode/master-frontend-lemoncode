///-- MODULES ************************************************************************************

// La separación de código en distintos ficheros es una buena práctica y ayuda a que
// tu código sea más reusable y mantenible. Los módulos nos permiten estructurar nuestra aplicación
// y encapsular partes que no queremos que estén expuestas directamente.
// Por lo general cada fichero constituye un módulo aunque un módulo puede estar también compuesto
// por varios ficheros
// Las acciones que podemos hacer sobre un módulo son:
// - Importar todas las funcionalidades del módulo
// - Importar algunas funcionalidades del módulo
// - Requerir todas las funcionalidades de otros módulos
// - Requerir
// Un módulo puede ser un namespace (objeto plano) que exporte funciones y/o constantes, pero además
// es bastante común que un módulo sea una función en lugar de un objeto plano

// ⚠ Importante: mostrar lo siguiente
// - exportar función por defecto en vez de objeto para mostrar el "default" en CommonJS y forkESModules
// - exportar función kebap-case (text) => text.replace(/[\s_]+/, '-').toLowerCase();
// - mostrar cómo importar todo en ESModules (import * as module)


// Demo ESModules
// https://codesandbox.io/s/81rv4n310l

// Demo CommonJS
// https://codesandbox.io/s/2x766oxy3n

// Demo ES5
// https://codesandbox.io/s/48qk1px1wx

// Demo AMD (obsoleto a día de hoy)
// http://next.plnkr.co/edit/IYYj6f7hXUACTAW7Df1R?preview
