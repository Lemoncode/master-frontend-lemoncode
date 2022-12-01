import {Clothes, Item} from "./item";

export class Shirt implements Item, Clothes {
    getName(): string {
        return "";
    }

    setColor(color: string): void {
    }

    setMaterial(material: string): void {
    }

    setPrice(price: number): void {
    }

    setSize(size: string): void {
    }
    
}
