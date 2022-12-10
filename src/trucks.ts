import { Collection } from "./data/Collection";
import { TruckService } from "./data/TruckService";
import { Truck } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { createTruckRow, hidrateOneType } from "./vehicleUtils";

const newTruckSection = document.getElementById('new-truck-section');
const editTruckSection = document.getElementById('edit-truck-section');

const formContainer = document.getElementById('forms');
const addTruckBtn = document.querySelector('.new') as HTMLButtonElement;

const storage = new LocalStorage();
const collection = new Collection(storage, 'trucks');
const truckService = new TruckService(collection);

const table = document.querySelector('table');
const tableManager = new Table(table, createTruckRow, identifyTruck);

const newForm = document.getElementById('new-truck') as HTMLFormElement;
const editForm = document.getElementById('edit-truck') as HTMLFormElement;

const newTruckEditor = new Editor(newForm, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'cargoType', 'capacity']);
const editTruckEditor = new Editor(editForm, onEdit.bind(null, tableManager), ['id', 'make', 'model', 'rentalPrice', 'rentedTo', 'cargoType', 'capacity']);

document.querySelectorAll('.cancel').forEach(b => {
    b.addEventListener('click', () => {
        newTruckEditor.clear();
        editTruckEditor.clear();
        
        newTruckEditor.remove();
        editTruckEditor.remove();
        
        newTruckSection.style.display = 'none';
        editTruckSection.style.display = 'none';
    });
})

newTruckSection.style.display = 'none';
editTruckSection.style.display = 'none';

newTruckEditor.remove();
editTruckEditor.remove();

hidrateOneType(truckService, tableManager);

addTruckBtn.addEventListener('click', () => {
    if (newTruckSection.style.display == 'none') {
        newTruckSection.style.display = '';
        newTruckEditor.attachTo(formContainer.querySelector('#new-truck-section'));
    } else {
        newTruckSection.style.display = 'none';
        newTruckEditor.remove();
    }
})

tableManager.element.addEventListener('click', onTableClick);

async function onTableClick(event: MouseEvent) {
    if (event.target instanceof HTMLButtonElement) {
        if (event.target.className == 'action edit') {
            newTruckEditor.remove();

            editTruckSection.style.display = '';
            editTruckEditor.attachTo(formContainer.querySelector('#edit-truck-section'));

            const id = event.target.parentElement.parentElement.dataset.id;
            const record = tableManager.get(id);
            editTruckEditor.setValues(record);
        } else if (event.target.className == 'action delete') {
            const flag = confirm('Are you sure you want to delete this?');
            if (flag) {
                const id = event.target.parentElement.parentElement.dataset.id;
                await truckService.delete(id);
                tableManager.remove(id);
            }
        }
    }
}

function identifyTruck(trucks: Truck[], id: string) {
    return trucks.find(c => c.id == id);
}

async function onSubmit(tableManager: Table, { make, model, rentalPrice, cargoType, capacity}) {
    if(Number.isNaN(Number(capacity))) {
        throw TypeError('Invalid capacity.');
    }

    if(Number.isNaN(Number(rentalPrice))) {
        throw TypeError('Invalid rental price.');
    }

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

    newTruckEditor.clear();
}

async function onEdit(tableManager: Table, { id, type, make, model, rentalPrice, cargoType, capacity, rentedTo }) {
    rentalPrice = Number(rentalPrice);
    capacity = Number(capacity);
    
    const result = await truckService.update(id, { type, make, model, rentalPrice, cargoType, capacity, rentedTo });
    tableManager.replace(id, result);

    editTruckEditor.remove();
    editTruckSection.style.display = 'none';
}