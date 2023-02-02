import {Measurable} from "./measurable.interface";

export class File implements Measurable {
    private _length: number;
    private _sent: number;


    get length(): number {
        return this._length;
    }

    set length(value: number) {
        this._length = value;
    }

    get sent(): number {
        return this._sent;
    }

    set sent(value: number) {
        this._sent = value;
    }

    getCurrent(): number {
        return this._sent;
    }

    getTotal(): number {
        return this._length;
    }
}
