import { CartStorage } from './cart-storage';

const cartStorage = new CartStorage();
const product = cartStorage.find(3);
