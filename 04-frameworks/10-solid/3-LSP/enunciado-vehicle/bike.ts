import {Vehicle} from "./vehicle";

export class Bike {
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


export class BikeAdapter extends Vehicle {
    bike: Bike;
    
    constructor() {
        super();
        this.bike = new Bike();
    }

    startEngine() {
        this.bike.startEngine();
    }

    accelerate() {
        this.bike.accelerate();
    }

    changeGear(gear: number) {
        if(gear === 1) {
            this.bike.changeGear(1,1);
        }

        if(gear === 2) {
            this.bike.changeGear(1,4);
        }

        if(gear === 3) {
            this.bike.changeGear(2,1);
        }
    }
}
