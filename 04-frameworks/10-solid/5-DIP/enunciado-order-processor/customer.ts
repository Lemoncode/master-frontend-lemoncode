import {OrderProcessor} from "./order-processor";
import {Order} from "./order";
import {Item} from "./item";

export class Customer
{
    private currentOrder: Order = null;

    addItem(item: Item): void {
        if(!this.currentOrder) {
            this.currentOrder = new Order();
        }
        return this.currentOrder.addItem(item);
    }

    deleteItem(item: Item): void {
        if(!this.currentOrder) {
            return;
        }
        return this.currentOrder.deleteItem(item);
    }

    buyItems(): void {
        if(!this.currentOrder) {
            return;
        }
        const processor = new OrderProcessor(); // <========= Aquí  *******************
        return processor.checkout(this.currentOrder);
    }
}

