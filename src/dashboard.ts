import { Collection } from "./data/Collection";
import { CarService } from "./data/CarService";
import { LocalStorage } from "./data/Storage";
import { TruckService } from "./data/TruckService";
import { Table } from "./dom/Table";
import { hidrateAllVehicles, createVehicleRow } from "./vehicleUtils";

const storage = new LocalStorage();
const carCollection = new Collection(storage, 'cars');
const truckCollection = new Collection(storage, 'trucks');
const carService = new CarService(carCollection);
const truckService = new TruckService(truckCollection);

const table = document.querySelector('table');
const tableManager = new Table(table, createVehicleRow);

hidrateAllVehicles(tableManager, carService, truckService);