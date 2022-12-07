import { Collection } from "./data/Collection";
import { CarService } from "./data/CarService";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";
import { createCarRow, hidrate } from "./vehicleUtils";

const storage = new LocalStorage();
const collection = new Collection(storage, 'cars');
const carService = new CarService(collection);

const table = document.querySelector('table');
const tableManager = new Table(table, createCarRow, identifyCar);

document.querySelector('tbody').addEventListener('click', onActionClick);

const newCarForm: HTMLFormElement = document.getElementById('new-car') as HTMLFormElement;

const newCarSection = document.getElementById('new-car-section');
newCarSection.style.display = 'none';

document.querySelector('.action.new').addEventListener('click', () => {
    if (newCarSection.style.display == 'none') {
        newCarSection.style.display = '';
        newCarForm.reset();
        newCarSection.querySelector('h3').textContent = 'New Car';
        newCarSection.querySelector('.confirm').textContent = 'New Car';
        editMode = false;
    } else {
        newCarSection.style.display = 'none';
        history.pushState(null, '', window.location.pathname);
        editMode = false;
    }
});

let editMode = false;

const form = document.getElementById('new-car') as HTMLFormElement;
const editor = new Editor(form, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'bodyType', 'numberOfSeats', 'transmission']);
start();

async function start() {
    document.querySelector('.cancel').addEventListener('click', () => {
        newCarSection.querySelector('h3').textContent = 'New Car';
        newCarSection.querySelector('.confirm').textContent = 'New Car';
        editMode = false;
        editor.clear();
        history.pushState(null, '', window.location.pathname);
    });
}

hidrate(carService, tableManager);

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

    if (editMode) {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('edit');

        const result = await carService.update(id, {
            type,
            make,
            model,
            rentalPrice: Number(rentalPrice),
            rentedTo: '',
            bodyType,
            numberOfSeats: Number(numberOfSeats),
            transmission,
        });

        const newRow = createCarRow(result);
        const oldRow = document.querySelector(`[data-id='${id}']`);

        oldRow.replaceWith(newRow);
        newCarSection.style.display = 'none';
        history.pushState(null, '', window.location.pathname);
        editMode = false;
    } else {
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
    }

    newCarForm.reset();
}

function onActionClick(event: any): void {    
    if (event.target.tagName == 'BUTTON') {
        const carRow: HTMLTableRowElement = event.target.parentElement.parentElement;
        const carId = carRow.dataset.id;

        if (event.target.classList.contains('edit')) {
            editCar(carId);
        } else if (event.target.classList.contains('delete')) {
            deleteCar(carRow);
        }
    }
}

async function editCar(carId: string) {
    newCarSection.style.display = '';
    newCarSection.querySelector('h3').textContent = 'Edit Car';
    newCarSection.querySelector('.confirm').textContent = 'Edit Car';

    const car = await carService.getById(carId);
    editMode = true;

    history.pushState(null, '', window.location.pathname + '?' + `edit=${carId}`);

    editor.setValues(car)
}

async function deleteCar(carRow: HTMLTableRowElement) {
    const flag = confirm('Are you sure you want to delete this car?');

    if (flag) {
        await carService.delete(carRow.dataset.id);
        carRow.remove();
    }
}