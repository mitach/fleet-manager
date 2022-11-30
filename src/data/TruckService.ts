import { CargoType, Truck } from "./models";
import { VehicleService } from "./Service";
import { Record } from "./Storage";

type TruckData = {
    make: string,
    model: string,
    rentalPrice: number,
    rentedTo: string | null,
    cargoType: CargoType,
    capacity: number,
}

export class TruckService extends VehicleService<Truck, TruckData> {
    protected parseRecord(record: Record): Truck {
        const data = record as any;

        const result = new Truck(
            data.id,
            data.make,
            data.model,
            data.rentalPrice,
            data.rentedTo,
            data.cargoType,
            data.capacity,
        );

        return result;
    }

    protected validate(data: any): void {
        if (typeof data.make != 'string') {
            throw new TypeError('Incompatible record. Invalid property "make"');
        }

        if (typeof data.model != 'string') {
            throw new TypeError('Incompatible record. Invalid property "model"');
        }

        if (typeof data.rentalPrice != 'number') {
            throw new TypeError('Incompatible record. Invalid property "rentalPrice"');
        }

        if (typeof data.rentedTo != 'string' && typeof data.rentedTo != null) {
            throw new TypeError('Incompatible record. Invalid property "rentedTo"');
        }

        if (data.cargoType != 'box' && data.cargoType != 'flatbed' && data.cargoType != 'van') {
            throw new TypeError('Incompatible record. Invalid property "cargoType"');
        }

        if (typeof data.capacity != 'number') {
            throw new TypeError('Incompatible record. Invalid property "capacity"');
        }
    }
}