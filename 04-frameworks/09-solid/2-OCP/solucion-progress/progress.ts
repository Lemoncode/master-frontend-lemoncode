import {Measurable} from "./measurable.interface";

export class Progress {

    constructor(private item: Measurable) {}

    getAsPercent(): number {
        return this.item.getCurrent() * 100 / this.item.getTotal();
    }
}
