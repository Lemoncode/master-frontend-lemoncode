import {Vehicle} from "./vehicle";

export class Bike extends Vehicle {
    startEngine() {
        // Lo dejamos vacío porque no hay que hacer nada
        return;
    }

    accelerate() {
        // Código necesario para pedalear más rápido
    }

    changeGear(sprocket, chainring) {
        // Código para cambiar de marcha según el plato y el piñón seleccionados
    }
}
