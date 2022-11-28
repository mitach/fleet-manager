import { Collection } from "./data/Collection";
import { CarService } from "./data/Service";
import { LocalStorage } from "./data/Storage";

console.log('dashboard');

start();

async function start() {
    const storage = new LocalStorage();
    const collection = new Collection(storage, 'cars');
    const carService = new CarService(collection);
    
    console.log(await carService.getAll());
    
    const carData = {
        make: 'Mitsubishi',
        model: 'Galant',
        rentalPrice: 80,
        rentedTo: 'Biser Stoynev',
        bodyType: 'sedan' as const,
        numberOfSeats: 5,
        transmission: 'automatic' as const,
    }

    const car = await carService.create(carData);

    console.log(car);

    console.log(await carService.getAll());

} 