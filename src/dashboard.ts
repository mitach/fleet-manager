import { LocalStorage } from "./data/Storage";

console.log('dashboard');

start();

async function start() {
    const storage = new LocalStorage();
    
    
    const carData = {
        make: 'Mitsubishi',
        model: 'Galant',
    }
    
    const car = await storage.create('cars', carData);
    
    console.log(await storage.getAll('cars'));

    console.log(await storage.getById('cars', car.id));

    const newCarData = {
        make: 'Nitsubishi',
        model: 'Evo 9',
    }

    await storage.update('cars', car.id, newCarData);
        
    console.log(await storage.getAll('cars'));
    
    console.log(await storage.getById('cars', car.id));

    await storage.delete('cars', car.id);

    console.log(await storage.getAll('cars'));
} 