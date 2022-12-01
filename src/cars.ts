import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";

const storage = new LocalStorage();
const collection = new Collection(storage, 'cars');
const carService = new CarService(collection);

start();

async function start() {
    const table = document.querySelector('table');
    const tableManager = new Table(table, createCarRow, identifyCar);

    const form = document.getElementById('new-car') as HTMLFormElement;
    const editor = new Editor(form, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'bodyType', 'numberOfSeats', 'transmission']);
    
    hidrate(tableManager);
}

async function hidrate(tableManager: Table) {
    const cars = await carService.getAll();

    for (let item of cars) {
        tableManager.add(item);
    }
}

function identifyCar(cars: Car[], id: string) {
    return cars.find(c => c.id == id);
}

function createCarRow(car: Car): HTMLTableRowElement {
    const row = tr({dataId: car.id},
        td({}, car.id),
        td({}, car.make),
        td({}, car.model),
        td({}, `${car.bodyType.charAt(0).toUpperCase()}${car.bodyType.slice(1)}`),
        td({}, car.numberOfSeats.toString()),
        td({}, `${car.transmission.charAt(0).toUpperCase()}${car.transmission.slice(1)}`),
        td({}, `$${car.rentalPrice}/day`),
        td({}, button({className: 'action edit'}, 'Edit'), button({className: 'action delete'}, 'Delete')),
    );

    return row;
}

async function onSubmit(tableManager: Table, {make, model, rentalPrice, rentedTo, bodyType, numberOfSeats, transmission}) {
    // const car = tableManager.get('d047-8efb');
    // console.log(car);

    // const row = tableManager.getRow('d047-8efb');
    // console.log(row);
    // row.remove();
    
    if(Number.isNaN(Number(numberOfSeats))) {
        throw TypeError('Invalid number of seats.');
    }

    if(Number.isNaN(Number(rentalPrice))) {
        throw TypeError('Invalid rental price.');
    }

    const result = await carService.create({
        make,
        model,
        rentalPrice: Number(rentalPrice),
        rentedTo: '',
        bodyType,
        numberOfSeats: Number(numberOfSeats),
        transmission
    });

    tableManager.add(result);
    
}