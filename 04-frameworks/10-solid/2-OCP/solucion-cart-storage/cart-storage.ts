import {StorageService} from "./storage-service.interface";

export class CartStorage
{
    private storage: StorageService;

    setStorageService(storage: StorageService) {
        this.storage = storage;
    }

    find(productID) {
        return this.storage.find(productID)
    }

    add(product) {
        this.storage.add(product);
    }

    update(product) {
        this.storage.update(product);
    }

    remove(product) {
        this.storage.remove(product);
    }
}
