import { CarService } from "./data/CarService";
import { Car, Truck } from "./data/models";
import { TruckService } from "./data/TruckService";
import { button, td, tr } from "./dom/dom";
import { Table } from "./dom/Table";

export async function hidrate(service: CarService | TruckService, tableManager: Table) {
    const vehicles = await service.getAll();

    for (let item of vehicles) {
        tableManager.add(item);
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