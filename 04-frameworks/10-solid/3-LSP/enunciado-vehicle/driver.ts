import {Vehicle} from "./vehicle";

export class Driver {
    go(v: Vehicle) {
        v.startEngine();
        v.changeGear(1)
        v.accelerate();
        v.accelerate();
        v.changeGear(2)
    }
}
