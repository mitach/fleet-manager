import { CarService } from "./data/CarService";
import { Car, Truck } from "./data/models";
import { TruckService } from "./data/TruckService";
import { a, button, td, tr } from "./dom/dom";
import { Table } from "./dom/Table";

export async function hidrateOneType(service: CarService | TruckService, tableManager: Table) {
    const vehicles = await service.getAll();

    for (let item of vehicles) {
        tableManager.add(item);
    }
}

export async function hidrateAllVehicles(tableManager: Table, ...services: any) {
    const vehicles = [];
    for (let service of services) {
        const vehiclesCollection = await service.getAll();
        vehicles.push(...vehiclesCollection);
    }

    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    
    const filteredVehicles = [];

    for (let item of vehicles) {
        if (type == 'cars') {
            if (item.type == 'Car') {
                filteredVehicles.push(item);
            }
        } else if (type == 'trucks') {
            if (item.type == 'Truck') {
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

export function createCarRow(car: Car): HTMLTableRowElement {
    const row = tr({dataId: car.id},
        td({}, car.id),
        td({}, car.make),
        td({}, car.model),
        td({}, `${car.bodyType.charAt(0).toUpperCase()}${car.bodyType.slice(1)}`),
        td({}, car.numberOfSeats.toString()),
        td({}, `${car.transmission.charAt(0).toUpperCase()}${car.transmission.slice(1)}`),
        td({}, `$${car.rentalPrice}/day`),
        td({}, 
            button({className: 'action edit'}, 'Edit'), 
            button({className: 'action delete'} , 'Delete')
        ),
    );

    return row;
}

export function createTruckRow(truck: Truck): HTMLTableRowElement {
    const row = tr({dataId: truck.id},
        td({}, truck.id),
        td({}, truck.make),
        td({}, truck.model),
        td({}, `${truck.cargoType.charAt(0).toUpperCase()}${truck.cargoType.slice(1)}`),
        td({}, `${truck.capacity.toString()} tons`),
        td({}, `$${truck.rentalPrice}/day`),
        td({}, 
            button({className: 'action edit'}, 'Edit'), 
            button({className: 'action delete'} , 'Delete')
        ),
    );

    return row;
}

export function createVehicleRow(vehicle: any): HTMLTableRowElement {
    const row = tr({dataId: vehicle.id},
        td({}, vehicle.id),
        td({}, vehicle.type),
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