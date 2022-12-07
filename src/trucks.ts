import { TruckService } from "./data/TruckService";
import { Collection } from "./data/Collection";
import { Truck } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { createTruckRow, hidrate } from "./vehicleUtils";

document.querySelector('tbody').addEventListener('click', onActionClick);

const newTruckForm: HTMLFormElement = document.getElementById('new-truck') as HTMLFormElement;

const newTruckSection = document.getElementById('new-truck-section');
newTruckSection.style.display = 'none';

document.querySelector('.action.new').addEventListener('click', () => {
    if (newTruckSection.style.display == 'none') {
        newTruckSection.style.display = '';
        newTruckForm.reset();
        newTruckSection.querySelector('h3').textContent = 'New Truck';
        newTruckSection.querySelector('.confirm').textContent = 'New Truck';
        editMode = false;
    } else {
        newTruckSection.style.display = 'none';
        history.pushState(null, '', window.location.pathname);
        editMode = false;
    }
});

const storage = new LocalStorage();
const collection = new Collection(storage, 'trucks');
const truckService = new TruckService(collection);

let editMode = false;

const table = document.querySelector('table');
const tableManager = new Table(table, createTruckRow, identifyTruck);
const form = document.getElementById('new-truck') as HTMLFormElement;
const editor = new Editor(form, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'cargoType', 'capacity']);
start();

async function start() {
    document.querySelector('.cancel').addEventListener('click', () => {
        newTruckSection.querySelector('h3').textContent = 'New Truck';
        newTruckSection.querySelector('.confirm').textContent = 'New Truck';
        editMode = false;
        editor.clear();
        history.pushState(null, '', window.location.pathname);
    });

}

hidrate(truckService, tableManager);

function identifyTruck(trucks: Truck[], id: string) {
    return trucks.find(c => c.id == id);
}

async function onSubmit(tableManager: Table, {type, make, model, rentalPrice, cargoType, capacity}) {
    if(Number.isNaN(Number(capacity))) {
        throw TypeError('Invalid number of capacity.');
    }

    if(Number.isNaN(Number(rentalPrice))) {
        throw TypeError('Invalid rental price.');
    }

    if (editMode) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('edit');

        const result = await truckService.update(id, {
            type,
            make,
            model,
            rentalPrice: Number(rentalPrice),
            rentedTo: '',
            cargoType,
            capacity: Number(capacity),
        });

        const newRow = createTruckRow(result);
        const oldRow = document.querySelector(`[data-id='${id}']`);

        oldRow.replaceWith(newRow);
        newTruckSection.style.display = 'none';
        history.pushState(null, '', window.location.pathname);
        editMode = false;
    } else {
        const result = await truckService.create({
            type: 'Truck',
            make,
            model,
            rentalPrice: Number(rentalPrice),
            rentedTo: '',
            cargoType,
            capacity: Number(capacity),
        });
        tableManager.add(result);
    }
    newTruckForm.reset();
}

function onActionClick(event: any): void {    
    if (event.target.tagName == 'BUTTON') {
        const truckRow: HTMLTableRowElement = event.target.parentElement.parentElement;
        const truckId = truckRow.dataset.id;

        if (event.target.classList.contains('edit')) {
            editTruck(truckId);
        } else if (event.target.classList.contains('delete')) {
            deleteTruck(truckRow);
        }
    }
}

async function editTruck(truckId: string) {
    newTruckSection.style.display = '';
    newTruckSection.querySelector('h3').textContent = 'Edit Truck';
    newTruckSection.querySelector('.confirm').textContent = 'Edit Truck';

    const truck = await truckService.getById(truckId);
    editMode = true;

    history.pushState(null, '', window.location.pathname + '?' + `edit=${truckId}`);

    editor.setValues(truck)
}

async function deleteTruck(truckRow: HTMLTableRowElement) {
    const flag = confirm('Are you sure you want to delete this truck?');

    if (flag) {
        await truckService.delete(truckRow.dataset.id);
        truckRow.remove();
    }
}