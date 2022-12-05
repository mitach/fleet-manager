import { Collection } from "./data/Collection";
import { CarService } from "./data/CarService";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";
import { Table } from "./dom/Table";
import { a, td, tr } from "./dom/dom";

const storage = new LocalStorage();
const carCollection = new Collection(storage, 'cars');
const truckCollection = new Collection(storage, 'trucks');
const carService = new CarService(carCollection);
const truckService = new TruckService(truckCollection);

const table = document.querySelector('table');
const tableManager = new Table(table, createVehicleRow);

start();

async function start() {
    hidrate(tableManager)
}

async function hidrate(tableManager: Table) {
    const cars = await carService.getAll();
    const trucks = await truckService.getAll();

    const vehicles: any = [...cars, ...trucks];

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    const filteredVehicles = [];

    for (let item of vehicles) {
        if (type == 'cars') {
            if (item.bodyType) {
                filteredVehicles.push(item);
            }
        } else if (type == 'trucks') {
            if (item.capacity) {
                filteredVehicles.push(item);
            }
        } else {
            filteredVehicles.push(item);
        }
    }

    if (params.has('availableOnly')) {
        for (let vehicle of filteredVehicles) {
            if (!vehicle.rentedTo) {
                tableManager.add(vehicle)
            }
        }
    } else {
        for (let vehicle of filteredVehicles) {
            tableManager.add(vehicle)
        }
    }
}

function createVehicleRow(vehicle: any): HTMLTableRowElement {
    const row = tr({dataId: vehicle.id},
        td({}, vehicle.id),
        td({}, `${vehicle.bodyType ? 'Car' : 'Truck'}`),
        td({}, vehicle.make),
        td({}, vehicle.model),
        td({}, `$${vehicle.rentalPrice}/day`),
        td({}, `${vehicle.rentedTo ? 'Rented' : 'Available'}`),
        td({}, 
            a({className: 'details-link', href: `/details.html?id=${vehicle.id}`}, 'Show Details'),
        ),
    );

    return row;
}