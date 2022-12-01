import {Order} from "./order";
import {OrderProcessorInterface} from "./order-processor.interface";

export class OrderProcessor implements OrderProcessorInterface {
    checkout(order: Order): void {
        return;
    }
}
