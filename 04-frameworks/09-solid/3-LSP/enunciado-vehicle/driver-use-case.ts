import {Driver} from "./driver";
import {Car} from "./car";
import {ElectricBus} from "./electric-bus";
import {Bike} from "./bike";
import {Vehicle} from "./vehicle";




const driver = new Driver();
const car = new Car();
const bus = new ElectricBus();
const bike = new Bike();

driver.go(car);
driver.go(bus);
//driver.go(bike)



// ¿Se puede sustituir Bike por su padre?
const myNewBike = new Bike();
myNewBike.startEngine();
myNewBike.changeGear(2, 1);
myNewBike.accelerate();
myNewBike.changeGear(2, 5);
