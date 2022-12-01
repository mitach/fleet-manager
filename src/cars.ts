import { CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { LocalStorage } from "./data/Storage";
import { Editor } from "./dom/Editor";

const storage = new LocalStorage();
const collection = new Collection(storage, 'cars');
const carService = new CarService(collection);

console.log('cars');

start();

async function start() {
    const form = document.getElementById('new-car') as HTMLFormElement;
    const editor = new Editor(form, onSubmit);

}

async function onSubmit(data) {
    carService.create(data);
}