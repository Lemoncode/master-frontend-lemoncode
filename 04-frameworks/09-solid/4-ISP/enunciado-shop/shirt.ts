import {Item} from "./item";

export class Shirt implements Item {
    applyDiscount(discount: number): number {
        return 0;
    }

    applyPromocode(promocode: string): number {
        return 0;
    }

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
