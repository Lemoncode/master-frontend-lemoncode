import {Vehicle} from "./vehicle";

export class Car extends Vehicle {

    // startEngine diferente del padre
    startEngine() {
        this.engageIgnition();
        super.startEngine();
    }

    private engageIgnition() {
        // Ignition procedure
    }

}

