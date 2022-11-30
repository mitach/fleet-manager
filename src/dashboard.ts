import { Collection } from "./data/Collection";
import { CarService } from "./data/CarService";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";

console.log('dashboard');

start();

async function start() {
    const storage = new LocalStorage();
    const collection = new Collection(storage, 'cars');
    const carService = new CarService(collection);
    const truckCollection = new Collection(storage, 'truck');
    const truckService = new TruckService(truckCollection)
    
    console.log(await carService.getAll());
    console.log(await truckService.getAll());
    
    const carData = {
        make: 'Mitsubishi',
        model: 'Galant',
        rentalPrice: 80,
        rentedTo: 'Biser Stoynev',
        bodyType: 'sedan' as const,
        numberOfSeats: 5,
        transmission: 'automatic' as const,
    }

    const truckData = {
        make: 'Iveco',
        model: 'Eurotruck',
        rentalPrice: 180,
        rentedTo: 'Biser Biserov',
        cargoType: 'box' as const,
        capacity: 500,
    }

    const car = await carService.create(carData);

    const truck = await truckService.create(truckData);
    console.log(truck)
    console.log(car);
    console.log(await carService.getAll());
    console.log(await truckService.getAll());

    await carService.delete(car.id);
    await truckService.delete(truck.id)

    console.log(await carService.getAll());

} 