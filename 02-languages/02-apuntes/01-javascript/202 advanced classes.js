///-- CLASS SYNTACTIC SUGAR ***********************************************************************

// Como acabamos de estudiar con el modelo prototípico, la notación de clases es azúcar sintáctico
// que simplifica la construccion de clases y nos abstrae de la tarea de lidiar con funciones 
// constructoras, prototipos y operador new. Javascript no implementa un sistema de clases built-in
// sino que lo simula gracias al prototipo y su herencia.

// Como demostración rápida para confirmar este hecho, vamos a traer de vuelta el ejemplo de
// notación de clases y herencia visto anteriormente (Automobile + Taxi) y lo vamos a transpilar
// a ES5 para comprobar el polyfill que se aplica en dicho caso:

// *** INPUT: Azúcar sintáctico

class Automobile {
  constructor(wheels) {
    this.wheels = wheels;
    this.kms = 0;
  }

  drive(kms) {
    this.kms += kms;
    console.log("Driving " + kms + "kms...");
  }

  showKms() {
    console.log("Total Kms: " + this.kms);
  }
}

class Taxi extends Automobile {
  constructor() {
    super(4);
    this.isOccupied = false;
  }

  service() {
    this.isOccupied = true;
  }

  drive(kms) {
    super.drive(kms);
    const serviceStatus = this.isOccupied ? "in service" : "free";
    console.log("And I am " + serviceStatus);
  }

  showKms() {
    console.log("Taxi Total Kms: " + this.kms);
  }
}

/*

*** OUTPUT: Resultado de la transpilación

https://babeljs.io/repl

Settings:
 - Borrar los targets o Forzar todas las transformaciones para asegurar transpilación a ES5.
 - Marca la opción LOOSE

*/


///-- CLASS FACTORY ******************************************************************************

/*
Puesto que, como acabamos de ver, las clases no son más que funciones (funciones constructoras),
compartirán importantes características con éstas. Una de esas características es que pueden ser 
ANÓNIMAS, lo cual tiene una implicación directa: podemos usar las clases como ciudadanos de primer
orden, ya sea para pasarlas como argumento o valor de retorno en funciones. En tal caso diremos que
estamos usando una "class expression".

Sabiendo esto, podemos implementar factorías de clases. En el siguiente ejemplo nos vamos a apoyar
en el concepto de CLOSURE para 'recordar' un mensaje y crear clases especializadas (distintas) que
procesen mensajes distintos. Veamos:
*/

function makeClass(message) {
  return class {
    talk() {
      console.log(message);
    }
  };
}

const Cat = makeClass("Meow!");
const cat = new Cat();
cat.talk();

const Dog = makeClass("Woof!");
const dog = new Dog();
dog.talk();
