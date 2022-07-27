# Principios SOLID

Los principios SOLID no son técnicas ni metodologías, son PRINCIPIOS, buenas prácticas, consejos...

Como indica el propio Robert C. Martin en su artículo “Getting a SOLID start” no se trata de reglas, ni leyes, ni verdades absolutas, sino más bien soluciones de sentido común a problemas comunes.

Los 5 principios SOLID de diseño de aplicaciones de software son:

- S – Single Responsibility Principle (SRP)
- O – Open/Closed Principle (OCP)
- L – Liskov Substitution Principle (LSP)
- I – Interface Segregation Principle (ISP)
- D – Dependency Inversion Principle (DIP)

Entre los objetivos de tener en cuenta estos 5 principios a la hora de escribir código encontramos:

- Crear software **robusto** y **estable**.
- Crear software **limpio** y **flexible ante los cambios**: que se pueda modificar fácilmente según necesidad, que sea **reutilizable** y **mantenible**.
- Crear software **escalable**: que acepte ser ampliado con nuevas funcionalidades de manera ágil.
- Crear software con **bajo acoplamiento** y **alta cohesión** entre sus partes.

En definitiva, desarrollar un software de **calidad**.

¿Cómo se mide la calidad de un software?

WTFs/minute: https://www.osnews.com/story/19266/wtfsm/

## S: Single responsability (SRP)

“A class should have one, and only one, reason to change.”

Según este principio **“una clase debería tener una, y solo una, razón para cambiar”**. La “razón para cambiar” es precisamente lo que Robert C. Martin identifica como “responsabilidad”.

## O: Open-Closed Principle (OCP)

“You should be able to extend a class behavior, without modifying it.”

El segundo principio de SOLID lo formuló Bertrand Meyer en 1988 en su libro “Object Oriented Software Construction” y dice: “Deberías ser capaz de extender el comportamiento de una clase, sin modificarla”. En otras palabras: las clases que usas deberían estar abiertas para poder extenderse y cerradas para modificarse.

**Para evolucionar no hay que tocar lo ya hecho**. Esto que en una primera impresión puede resultar una paradoja, es importantísimo a la hora de desarrollar clases, librerías o frameworks.

## L: Liskov Substitution Principle (LSP)

“Derived classes must be substitutable for their base classes.”

La L de SOLID alude al apellido de quien lo creó, Barbara Liskov, y dice que “las clases derivadas deben poder sustituirse por sus clases base”.

Esto significa que los objetos deben poder ser reemplazados por instancias de sus subtipos sin alterar el correcto funcionamiento del sistema o lo que es lo mismo: **si en un programa utilizamos cierta clase, deberíamos poder usar cualquiera de sus subclases sin interferir en la funcionalidad del programa**.  

Según Robert C. Martin incumplir el Liskov Substitution Principle (LSP) implica violar también el principio de Abierto/Cerrado.

## I: Interface Segregation Principle (ISP)

“Make fine grained interfaces that are client specific.”

Respecto al principio de segregación de la interfaz, el tío Bob (Uncle Bob) sugiere lo siguiente: “Haz interfaces que sean específicas para un tipo de cliente”, es decir, para una finalidad concreta.

En este sentido, según el Interface Segregation Principle (ISP), **es preferible contar con muchas interfaces que definan pocos métodos** que tener una interface forzada a implementar muchos métodos a los que no dará uso.

## D:  Dependency inversion principle 

“Depend on abstractions, not on concretions.”

El último prinicipio dice: **“Depende de abstracciones, no de clases concretas”**. Así, Robert C. Martin recomienda:

```
Los módulos de alto nivel no deberían depender de módulos de bajo nivel. Ambos deberían depender de abstracciones.
Las abstracciones no deberían depender de los detalles. Los detalles deberían depender de las abstracciones.
```

El objetivo del Dependency Inversion Principle (DIP) consiste en reducir las dependencias entre los módulos del código, es decir, alcanzar un bajo acoplamiento de las clases.

## Enlaces de interés

- https://diego.com.es/solid-principios-del-diseno-orientado-a-objetos-en-php
- Patrones de programación: https://en.wikipedia.org/wiki/Architectural_pattern
