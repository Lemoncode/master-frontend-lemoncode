import {Item} from "./item";

export class Book implements Item {
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
        return;
    }

    setMaterial(material: string): void {
        return;
    }

    setPrice(price: number): void {
    }

    setSize(size: string): void {
        return;
    }

}
