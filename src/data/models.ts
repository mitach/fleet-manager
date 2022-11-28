import { Record, RecordId } from "./Storage";


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
        public bodyType: 'sedan' | 'suv' | 'hatchback',
        public numberOfSeats: number,
        public transmission: 'manual' | 'automatic',
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
        public cargoType: 'box' | 'flatbed' | 'van',
        public capacity: number,
    ) {
        super(id, make, model, rentalPrice, rentedTo);
    }
}