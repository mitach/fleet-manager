import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Car } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { button, td, tr } from "./dom/dom";
import { Editor } from "./dom/Editor";
import { Table } from "./dom/Table";

document.querySelector('tbody').addEventListener('click', onActionClick);

const newCarForm: HTMLFormElement = document.getElementById('new-car') as HTMLFormElement;

const newCarSection = document.getElementById('new-car-section');
newCarSection.style.display = 'none';

document.querySelector('.action.new').addEventListener('click', () => {
    if (newCarSection.style.display == 'none') {
        newCarSection.style.display = '';
        newCarSection.querySelector('h3').textContent = 'New Car';
        newCarSection.querySelector('.confirm').textContent = 'New Car';
    } else {
        newCarSection.style.display = 'none';
    }
});

const storage = new LocalStorage();
const collection = new Collection(storage, 'cars');
const carService = new CarService(collection);

let editMode = false;

const table = document.querySelector('table');
const tableManager = new Table(table, createCarRow, identifyCar);
const form = document.getElementById('new-car') as HTMLFormElement;
const editor = new Editor(form, onSubmit.bind(null, tableManager), ['make', 'model', 'rentalPrice', 'rentedTo', 'bodyType', 'numberOfSeats', 'transmission']);
start();

async function start() {
    // document.querySelectorAll('.cancel').forEach(b => {
    //     b.addEventListener('click', () => {
    //         editor.clear();
    //     });
    // });

    document.querySelector('.cancel').addEventListener('click', () => {
        newCarSection.querySelector('h3').textContent = 'New Car';
        newCarSection.querySelector('.confirm').textContent = 'New Car';
        editMode = false;
        editor.clear();
    });

    hidrate(tableManager);
}

async function hidrate(tableManager: Table) {
    const cars = await carService.getAll();

    for (let item of cars) {
        tableManager.add(item);
    }
}

function identifyCar(cars: Car[], id: string) {
    return cars.find(c => c.id == id);
}

function createCarRow(car: Car): HTMLTableRowElement {
    const row = tr({dataId: car.id},
        td({}, car.id),
        td({}, car.make),
        td({}, car.model),
        td({}, `${car.bodyType.charAt(0).toUpperCase()}${car.bodyType.slice(1)}`),
        td({}, car.numberOfSeats.toString()),
        td({}, `${car.transmission.charAt(0).toUpperCase()}${car.transmission.slice(1)}`),
        td({}, `$${car.rentalPrice}/day`),
        td({}, 
            button({className: 'action edit'}, 'Edit'), 
            button({className: 'action delete'} , 'Delete')
        ),
    );

    return row;
}

async function onSubmit(tableManager: Table, {id, make, model, rentalPrice, rentedTo, bodyType, numberOfSeats, transmission}) {
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

        history.pushState(null, '', window.location.pathname);

        editMode = false;
    } else {
        const result = await carService.create({
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



function onActionClick(event) {    
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

async function editCar(carId) {
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