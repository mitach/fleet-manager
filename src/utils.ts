import { CarService } from "./data/CarService";
import { TruckService } from "./data/TruckService";
import { Table } from "./dom/Table";

export function generateId():string {
    return '0000-0000'.replace(/0/g, () => (Math.random() * 16 | 0).toString(16))
}

export async function hidrate(service: CarService | TruckService, tableManager: Table) {
    const vehicles = await service.getAll();

    for (let item of vehicles) {
        tableManager.add(item);
    }
}