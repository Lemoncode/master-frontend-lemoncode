export interface Item
{
    getName(): string;

    applyDiscount(discount: number): number;
    applyPromocode(promocode: string): number;

    setColor(color: string): void;
    setSize(size: string): void;
    setMaterial(material: string): void;

    setPrice(price: number): void;
}
