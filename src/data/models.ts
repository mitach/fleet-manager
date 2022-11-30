import { Record, RecordId } from "./Storage";

export type BodyType = 'sedan' | 'suv' | 'hatchback';
export type CargoType = 'box' | 'flatbed' | 'van';
export type Transmission = 'manual' | 'automatic';

abstract class Vehicle implements Record {
    constructor(
        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null
    ) {}
}

export class Car extends Vehicle {
    constructor(
        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null,
        public bodyType: BodyType,
        public numberOfSeats: number,
        public transmission: Transmission,
    ) {
        super(id, make, model, rentalPrice, rentedTo);
    } 
}

export class Truck extends Vehicle {
    constructor(        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null,
        public cargoType: CargoType,
        public capacity: number,
    ) {
        super(id, make, model, rentalPrice, rentedTo);
    }
}