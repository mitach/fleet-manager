import { Collection } from "./data/Collection";
import { CarService } from "./data/CarService";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { createCarRow, hidrateOneType } from "./vehicleUtils";

const newCarSection = document.getElementById('new-car-section');
const editCarSection = document.getElementById('edit-car-section');

const formContainer = document.getElementById('forms');
const addCarBtn = document.querySelector('.new') as HTMLButtonElement;

const storage = new LocalStorage();
const collection = new Collection(storage, 'cars');
const carService = new CarService(collection);

const table = document.querySelector('table');
const tableManager = new Table(table, createCarRow, identifyCar);

const newForm = document.getElementById('new-car') as HTMLFormElement;
const editForm = document.getElementById('edit-car') as HTMLFormElement;

const newCarEditor = new Editor(newForm, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'bodyType', 'numberOfSeats', 'transmission']);
const editCarEditor = new Editor(editForm, onEdit.bind(null, tableManager), ['id', 'make', 'model', 'rentalPrice', 'rentedTo', 'bodyType', 'numberOfSeats', 'transmission']);

document.querySelectorAll('.cancel').forEach(b => {
    b.addEventListener('click', () => {
        newCarEditor.clear();
        editCarEditor.clear();
        
        newCarEditor.remove();
        editCarEditor.remove();
        
        newCarSection.style.display = 'none';
        editCarSection.style.display = 'none';
    });
})

newCarSection.style.display = 'none';
editCarSection.style.display = 'none';

newCarEditor.remove();
editCarEditor.remove();

hidrateOneType(carService, tableManager);

addCarBtn.addEventListener('click', () => {
    if (newCarSection.style.display == 'none') {
        newCarSection.style.display = '';
        newCarEditor.attachTo(formContainer.querySelector('#new-car-section'));
    } else {
        newCarSection.style.display = 'none';
        newCarEditor.remove();
    }
})

tableManager.element.addEventListener('click', onTableClick);

async function onTableClick(event: MouseEvent) {
    if (event.target instanceof HTMLButtonElement) {
        if (event.target.className == 'action edit') {
            newCarEditor.remove();

            editCarSection.style.display = '';
            editCarEditor.attachTo(formContainer.querySelector('#edit-car-section'));

            const id = event.target.parentElement.parentElement.dataset.id;
            const record = tableManager.get(id);
            editCarEditor.setValues(record);
        } else if (event.target.className == 'action delete') {
            const flag = confirm('Are you sure you want to delete this?');
            if (flag) {
                const id = event.target.parentElement.parentElement.dataset.id;
                await carService.delete(id);
                tableManager.remove(id);
            }
        }
    }
}

function identifyCar(cars: Car[], id: string) {
    return cars.find(c => c.id == id);
}

async function onSubmit(tableManager: Table, {type, make, model, rentalPrice, bodyType, numberOfSeats, transmission}) {
    if(Number.isNaN(Number(numberOfSeats))) {
        throw TypeError('Invalid number of seats.');
    }

    if(Number.isNaN(Number(rentalPrice))) {
        throw TypeError('Invalid rental price.');
    }

    const result = await carService.create({
        type: 'Car',
        make,
        model,
        rentalPrice: Number(rentalPrice),
        rentedTo: '',
        bodyType,
        numberOfSeats: Number(numberOfSeats),
        transmission,
    });

    tableManager.add(result);

    newCarEditor.clear();
}

async function onEdit(tableManager: Table, { id, type, make, model, rentalPrice, bodyType, numberOfSeats, transmission, rentedTo }) {
    rentalPrice = Number(rentalPrice);
    numberOfSeats = Number(numberOfSeats);
    
    const result = await carService.update(id, { type, make, model, rentalPrice, bodyType, numberOfSeats, transmission, rentedTo });
    tableManager.replace(id, result);

    editCarEditor.remove();
    editCarSection.style.display = 'none';
}