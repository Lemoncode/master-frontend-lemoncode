import {Vehicle} from "./vehicle";

export class ElectricBus extends Vehicle {

    // accelerate diferente del padre
    accelerate() {
        this.increaseVoltage();
        this.connectIndividualEngines();
    }

    private increaseVoltage() {
        // Electric logic
    }

    private connectIndividualEngines() {
        // Connection logic
    }

}
