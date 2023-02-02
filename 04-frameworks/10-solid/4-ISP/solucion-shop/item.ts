export interface Item
{
    getName(): string;
    setPrice(price: number): void;
}

export interface Clothes
{
    setColor(color: string): void;
    setSize(size: string): void;
    setMaterial(material: string): void;
}

export interface Discountable
{
    applyDiscount(discount: number): number;
    applyPromocode(promocode: string): number;
}
