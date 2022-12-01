import {CartStorage} from "./cart-storage";
import {LocalStorageService} from "./storage-local";
import { IndexedDBStorageService } from './storage-indexedDB';

const storageService = new LocalStorageService();
//const storageService = new IndexedDBStorageService();

const cartStorage = new CartStorage();
cartStorage.setStorageService(storageService);

const product = cartStorage.find(3);
