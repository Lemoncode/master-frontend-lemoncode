import {StorageService} from "./storage-service.interface";

export class LocalStorageService implements StorageService
{
    find(productID) {
        let products = JSON.parse(localStorage.get('cart', []));
        return products.find( p => p.id === productID);
    }

    add(product) {}
    update(product) {}
    remove(product) {}
}
