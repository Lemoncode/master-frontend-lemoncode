import {IndexedDBStorageService} from "./storage-indexedDB";
import {CartStorage} from "./cart-storage";

const storageService = new IndexedDBStorageService();

const cartStorage = new CartStorage();
cartStorage.setStorageService(storageService);

const product = cartStorage.find(3);
