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

export abstract class VehicleService<T, TData> implements Service<T, TData> {
    constructor(
        private collection: Collection
    ) {}

    async getAll(): Promise<T[]> {
        const records = (await this.collection.getAll()).map(r => this.parseRecord(r));

        return records;
    }

    async getById(id: string): Promise<T> {
        const record = await this.collection.getById(id);
        
        return this.parseRecord(record);
    }

    async create(data: TData): Promise<T> {
        this.validate(data);
        const record = await this.collection.create(data);

        return this.parseRecord(record)
    }

    async update(id: string, data: TData): Promise<T> {
        this.validate(data);
        const record = await this.collection.update(id, data);

        return this.parseRecord(record);
    }

    async delete(id: string): Promise<void> {
        return this.collection.delete(id);
    }

    protected abstract parseRecord(record: Record): T 
    protected abstract validate(data: any): void 
}

