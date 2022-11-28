import { Collection } from "./Collection";
import { Car } from "./models";
import { Record, RecordId } from "./Storage";

export interface Service<T, TData> {
    getAll(): Promise<T[]>;
    getById(id: RecordId): Promise<T>;
    create(data: TData): Promise<T>;
    update(id: RecordId, data: TData): Promise<T>;
    delete(id: RecordId): Promise<void>;
}

type CarData = {
    make: string,
    model: string,
    rentalPrice: number,
    rentedTo: string | null,
    bodyType: 'sedan' | 'suv' | 'hatchback',
    numberOfSeats: number,
    transmission: 'manual' | 'automatic',
}

export class CarService implements Service<Car, CarData> {
    constructor(
        private collection: Collection
    ) {}

    async getAll(): Promise<Car[]> {
        const records = (await this.collection.getAll()).map(r => this.parseRecord(r));

        return records;
    }

    async getById(id: string): Promise<Car> {
        const record = await this.collection.getById(id);
        
        return this.parseRecord(record);
    }

    async create(data: CarData): Promise<Car> {
        this.validate(data);
        const record = await this.collection.create(data);

        return this.parseRecord(record)
    }

    async update(id: string, data: CarData): Promise<Car> {
        this.validate(data);
        const record = await this.collection.update(id, data);

        return this.parseRecord(record);
    }

    async delete(id: string): Promise<void> {
        return this.collection.delete(id);
    }

    private parseRecord(record: Record): Car {
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

    private validate(data: CarData): void {
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