# Testing en Angular

En Angular se distinguen dos tipos de testing:

- Unit testing
- E2E testing

## Unit testing

Al hablar de tests unitarios, estamos hablando de testear si las piezas (unidades) de nuestra aplicación funcionan correctamente por sí mismas. Es decir, que cogeremos cada una de las piezas de forma aislada y comprobaremos que dicha pieza hace el trabajo que debe hacer.

En Angular tenemos las siguientes piezas:

- Módulos (clases decoradas con @NgModule)
- Componentes (clases decoradas con @Component)
- Servicios (Clases decoradas con @Injectable)
- Directivas (Clases decoradas con @Directive)
- Pipes (Clases decoradas con @Pipe)

Veremos cómo testear de forma unitaria cada una de estas unidades empezando por las más fáciles y terminando con las de mayor dificultad.

## E2e testing

En el testing End to end las pruebas se hacen desde el punto de vista del usuario que utiliza la aplicación.

Son tests de caja negra en los que se prueba la correcta interacción entre el usuario y la aplicación.