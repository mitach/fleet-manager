import { BodyType, Car, Transmission } from "./models";
import { VehicleService } from "./Service";
import { Record } from "./Storage";

type CarData = {
    make: string,
    model: string,
    rentalPrice: number,
    rentedTo: string | null,
    bodyType: BodyType,
    numberOfSeats: number,
    transmission: Transmission,
}

export class CarService extends VehicleService<Car, CarData> {
    protected parseRecord(record: Record): Car {
        const data = record as any;

        const result = new Car(
            data.id,
            data.make,
            data.model,
            data.rentalPrice,
            data.rentedTo,
            data.bodyType,
            data.numberOfSeats,
            data.transmission,
        );

        return result;  
    }

    protected validate(data: CarData): void {
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

        if (data.bodyType != 'sedan' && data.bodyType != 'suv' && data.bodyType != 'hatchback') {
            throw new TypeError('Incompatible record. Invalid property "bodyType"');
        }

        if (typeof data.numberOfSeats != 'number') {
            throw new TypeError('Incompatible record. Invalid property "numberOfSeats"');
        }

        if (data.transmission != 'manual' && data.transmission != 'automatic') {
            throw new TypeError('Incompatible record. Invalid property "transmission"');
        }
    }
}