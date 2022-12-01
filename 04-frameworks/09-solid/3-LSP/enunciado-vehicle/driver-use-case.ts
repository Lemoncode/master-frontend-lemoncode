import {Driver} from "./driver";
import {Car} from "./car";
import {ElectricBus} from "./electric-bus";
import {Bike, BikeAdapter} from "./bike";
import {Vehicle} from "./vehicle";




const driver = new Driver();
const car = new Car();
const bus = new ElectricBus();
//const bike = new Bike();
//const bikeAdapter = new BikeAdapter();

driver.go(car);
driver.go(bus);
//driver.go(bikeAdapter);



// ¿Se puede sustituir Bike por su padre?
const myNewBike = new Bike();
myNewBike.startEngine();
myNewBike.changeGear(2, 1);
myNewBike.accelerate();
myNewBike.changeGear(2, 5);
