import { CarData, CarService } from "./data/CarService";
import { Collection } from "./data/Collection";
import { Vehicle } from "./data/models";
import { LocalStorage } from "./data/Storage";
import { TruckData, TruckService } from "./data/TruckService";
import { button, div, form, h3, input, label, main, p, span, strong } from "./dom/dom";

const storage = new LocalStorage();
const carCollection = new Collection(storage, 'cars');
const truckCollection = new Collection(storage, 'trucks');
const carService = new CarService(carCollection);
const truckService = new TruckService(truckCollection);

hidrate();

async function hidrate() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const vehicles = [
        ...await carService.getAll(),
        ...await truckService.getAll()
    ]

    const vehicle = vehicles.find(x => x.id == id);

    const main = createDetails(vehicle);
    document.querySelector('main').replaceWith(main);
}

function createDetails(vehicle: any): HTMLElement {
    const details = main({},
        h3({}, `${vehicle.make} ${vehicle.model}`),
        div({className: 'details'},
            p({}, span({className: 'col'}, 'ID:'), strong({}, vehicle.id)),
            vehicle.bodyType ? p({}, span({className: 'col'}, 'Body type:'), strong({}, `${vehicle.bodyType.charAt(0).toUpperCase()}${vehicle.bodyType.slice(1)}`)) : '',
            vehicle.numberOfSeats ? p({}, span({className: 'col'}, 'Seats:'), strong({}, vehicle.numberOfSeats)) : '',
            vehicle.transmission ? p({}, span({className: 'col'}, 'Transmission:'), strong({}, `${vehicle.transmission.charAt(0).toUpperCase()}${vehicle   .transmission.slice(1)}`)) : '',
            vehicle.cargoType ? p({}, span({className: 'col'}, 'Cargo type:'), strong({}, `${vehicle.cargoType.charAt(0).toUpperCase()}${vehicle.cargoType.slice(1)}`)) : '',
            vehicle.capacity ? p({}, span({className: 'col'}, 'Capacity:'), strong({}, vehicle.capacity)) : '',
            p({}, span({className: 'col'}, 'Rental price:'), strong({}, `$${vehicle.rentalPrice}/day`)),
        ),
        div({className: 'rental'},
            p({}, span({className: 'col'}, 'Status:'), strong({}, `${vehicle.rentedTo ? 'Rented' : 'Available'}`)),
            vehicle.rentedTo ? p({}, 
                span({className: 'col'}, 'Rented to:'), 
                strong({}, vehicle.rentedTo),
                button({className: 'action release', onClick: onEndContract}, 'End contract')
                ) : '',
            !vehicle.rentedTo ? p({}, 
                    form({onsubmit: onNewRentContract}, 
                        label({}, span({}, 'Rent to'), input({type: 'text', name: 'name'})),
                        button({className: 'action rent', type: 'sumit'}, 'Confirm')
                    )
                ) : '',
        )
    );

    return details;
}

async function onEndContract() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const flag = confirm('Are you sure you want to end the contract?');

    if (flag) {

        const vehicles = [
            ...await carService.getAll(),
            ...await truckService.getAll()
        ]
    
        const vehicle = vehicles.find(x => x.id == id);

        vehicle.rentedTo = '';

        if (vehicle.type == 'Car') {
            await carService.update(id, vehicle as CarData);
        } else if (vehicle.type == 'Truck') {
            await truckService.update(id, vehicle as TruckData);
        }

        const newRentalDiv = div({className: 'rental'},
            p({}, span({className: 'col'}, 'Status:'), strong({}, `${vehicle.rentedTo ? 'Rented' : 'Available'}`)),
            vehicle.rentedTo ? p({}, 
                span({className: 'col'}, 'Rented to:'), 
                strong({}, vehicle.rentedTo),
                button({className: 'action release', onClick: onEndContract}, 'End contract')
            ) : '',
            !vehicle.rentedTo ? p({}, 
                form({onsubmit: onNewRentContract}, 
                    label({}, span({}, 'Rent to'), input({type: 'text', name: 'name'})),
                    button({className: 'action rent'}, 'Confirm')
                )
            ) : '',
        );

        document.querySelector('.rental').replaceWith(newRentalDiv);
    }
}

async function onNewRentContract(e) {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target));

    if (formData.name == '') {
        alert('Name is not correct!');
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    const vehicles = [
        ...await carService.getAll(),
        ...await truckService.getAll()
    ]

    const vehicle = vehicles.find(x => x.id == id);
    
    vehicle.rentedTo = formData.name as string;

    if (vehicle.type == 'Car') {
        await carService.update(id, vehicle as CarData);
    } else if (vehicle.type == 'Truck') {
        await truckService.update(id, vehicle as TruckData);
    }

    const newRentalDiv = div({className: 'rental'},
        p({}, span({className: 'col'}, 'Status:'), strong({}, `${vehicle.rentedTo ? 'Rented' : 'Available'}`)),
        vehicle.rentedTo ? p({}, 
            span({className: 'col'}, 'Rented to:'), 
            strong({}, vehicle.rentedTo),
            button({className: 'action release', onClick: onEndContract}, 'End contract')
        ) : '',
        !vehicle.rentedTo ? p({}, 
            form({onsubmit: onNewRentContract}, 
                label({}, span({}, 'Rent to'), input({type: 'text', name: 'name'})),
                button({className: 'action rent'}, 'Confirm')
            )
        ) : '',
    );

    document.querySelector('.rental').replaceWith(newRentalDiv);
}