import {Discountable, Item} from "./item";

export class Book implements Item, Discountable {
    applyDiscount(discount: number): number {
        return 0;
    }

    applyPromocode(promocode: string): number {
        return 0;
    }

    getName(): string {
        return "";
    }

    setPrice(price: number): void {
    }

}
