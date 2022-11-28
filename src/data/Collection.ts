import { Record, RecordId, Storage } from "./Storage";

export class Collection {
    constructor(
        private storage: Storage,
        private name: string,
    ) {}

    getAll(): Promise<Record[]> {
        return this.storage.getAll(this.name);
    }

    getById(id: RecordId): Promise<Record> {
        return this.storage.getById(this. name, id)
    }

    create(data: any): Promise<Record> {
        return this.storage.create(this.name, data)
    }

    update(id: RecordId, data: any): Promise<Record> {
        return this.storage.update(this.name, id, data);
    }

    delete(id: RecordId): Promise<void> {
        return this.storage.delete(this.name, id);
    }
}