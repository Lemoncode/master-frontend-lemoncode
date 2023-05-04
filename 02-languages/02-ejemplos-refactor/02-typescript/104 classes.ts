///-- CLASSES *************************************************************************************

// Al igual que en ES6 las clases se escriben utilizando el keyword "class" pero con una ligera
// diferencia. Para TypeScript todas las propiedades propias de instancias deben estar declaradas.
class Ghost {
  constructor(name: string, personality: string) {
    this.name = name; // [ts] Property 'name' does not exist on type 'Ghost'.
    this.personality = personality; // [ts] Property 'personality' does not exist on type 'Ghost'.
  }
}
class Ghost {
  public name: string;
  public personality: string;
  constructor(name: string, personality: string) {
    this.name = name;
    this.personality = personality;
  }
}

// Para declarar una propiedad basta con declararla con su tipo correspondiente a nivel de clase:
class Sweep {
  public readonly name: string;
  public readonly model: string | number;
  constructor(name: string, model: string | number) {
    this.name = name;
    this.model = model;
  }
}

class Witch {
  name: string;
  sweep: Sweep;

  constructor(name: string, sweep: Sweep) {
    this.name = name;
    this.sweep = sweep;
  }
}

const mim = new Witch("Madam Mim", new Sweep("Nimbus", 2000));

// -- PUBLIC, PRIVATE, PROTECTED PROPERTIES
// En TypeScript podemos añadir modificadores de acceso a las propiedades utilizando "public",
// "private", y "protected". Por defecto las variables declaradas sin modificadores de acceso se
// consideran públicas.

enum Hunger {
  Low,
  Medium,
  High,
  Full,
}
class Undead {
  protected diet: string;
  protected hunger: Hunger;
  constructor(diet: string) {
    this.diet = diet;
    this.hunger = Hunger.High;
  }

  public getHunger() {
    return this.hunger;
  }

  public feed() {
    this.hunger = this.setHunger();
  }

  private setHunger(): Hunger {
    switch (this.hunger) {
      case Hunger.High:
        return Hunger.Medium;
      case Hunger.Medium:
        return Hunger.Low;
      default:
        return Hunger.Full;
    }
  }
}

class Vampire extends Undead {
  private clan: string;
  constructor(clan: string) {
    super("blood");
    this.clan = clan;
  }
  public greet() {
    console.log(`I'm a vampire of the ${this.clan}'s clan and I'll drink all your ${this.diet}`);
  }
}

const v1 = new Vampire("Malkavian");
console.log(v1.getHunger()); // "high"
v1.greet(); // I'm a vampire of the Malkavian's clan and I'll drink all your blood
v1.feed();
console.log(v1.getHunger()); // "medium"

const z1 = new Undead("brains");

// -- STATIC PROPERTIES
// Podemos añadir propiedades estáticas mediante el operador "static".
class Demon extends Undead {
  static readonly weakness = "Cross";
}

const demon1 = new Demon("soul");
// A una propiedad estática se accede a través de la clase y no de la instancia.
console.log(Demon.weakness); // "Cross"
demon1.weakness; // [ts] Property 'weakness' is a static member of type 'Demon'

// -- ABSTRACT CLASSES
// Mediante el operator "abstract" podemos crear clases que no puedan generar instancias
abstract class Monster {
  protected abstract name: string;
  abstract scare();
}

class Werewolf extends Monster {
  constructor(protected name: string) {
    super();
    this.name = name;
  }
  scare() {
    console.log(`**Growls..`);
  }
  run() {}
}

const monster = new Monster(); // [ts] Cannot create an instance of an abstract class
const lucian = new Werewolf("Lucian");

// Usando clases como interfaces
class House {
  name: string;
  location: string;
}

interface HountedHouse extends House {
  ghosts: Ghost[];
}

const boleskineHouse: HountedHouse = {
  name: "Boleskine House",
  location: "Scotland",
  ghosts: [new Ghost("Casper", "friendly")],
};

// -- SHORTHANDS DE CONSTRUCTOR
// Ya hemos visto que para añadir propiedades en el constructor debemos indicar previamente qué
// propiedades vamos a usar. TypeScript nos proporciona una forma abreviada de asignar propiedades
// en el constructor y es añadiendo los modificadores de acceso a los parámetros de "constructor"

class Pumpkin {
  constructor(private size: number, public weight: number) {}
  getSize() {
    return this.size;
  }
}

const p1 = new Pumpkin(30, 24);
console.log(p1.weight); // 24
console.log(p1.getSize()); // 30
