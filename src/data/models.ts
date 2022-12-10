import { Record, RecordId } from "./Storage";

export type BodyType = 'sedan' | 'suv' | 'hatchback';
export type CargoType = 'box' | 'flatbed' | 'van';
export type Transmission = 'manual' | 'automatic';

export abstract class Vehicle implements Record {
    constructor(
        public type: string,
        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null
    ) {}
}

export class Car extends Vehicle {
    constructor(
        public type: string = 'Car',
        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null,
        public bodyType: BodyType,
        public numberOfSeats: number,
        public transmission: Transmission,
    ) {
        super(type, id, make, model, rentalPrice, rentedTo);
    } 
}

export class Truck extends Vehicle {
    constructor(
        public type: string = 'Truck',
        public id: RecordId,
        public make: string,
        public model: string,
        public rentalPrice: number,
        public rentedTo: string | null,
        public cargoType: CargoType,
        public capacity: number,
    ) {
        super(type, id, make, model, rentalPrice, rentedTo);
    }
}