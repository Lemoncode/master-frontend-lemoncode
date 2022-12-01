import {StorageService} from "./storage-service.interface";

export class SessionStorageService implements StorageService
{
    find(productID) {
        let products = JSON.parse(sessionStorage.get('cart', []));
        return products.find( p => p.id === productID);
    } 

    add(product) {}
    update(product) {}
    remove(product) {}
}
