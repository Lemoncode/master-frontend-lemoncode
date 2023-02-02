import {Order} from "./order";

export interface OrderProcessorInterface
{
    checkout(order: Order): void;
}
