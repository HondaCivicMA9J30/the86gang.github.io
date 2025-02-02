// Agregar funciones aquí si es necesario, por ejemplo para subir y mostrar coches
import { database } from './firebaseConfig.js';
import { ref, set, onValue, remove, push } from "firebase/database";

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('car-form');
    const carGallery = document.getElementById('car-gallery');

    // Generar un identificador único para el usuario si no existe
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', 'user-' + Date.now());
    }
    const userId = localStorage.getItem('userId');

    // Función para cargar coches desde Firebase
    function loadCars() {
        const carsRef = ref(database, 'cars');
        onValue(carsRef, (snapshot) => {
            carGallery.innerHTML = ''; // Limpiar la galería antes de cargar los coches
            const cars = snapshot.val();
            for (let id in cars) {
                const car = cars[id];
                addCarToGallery(car.name, car.image, car.description, car.userId, id);
            }
        });
    }

    // Función para guardar un coche en Firebase
    function saveCar(car) {
        const newCarRef = push(ref(database, 'cars'));
        set(newCarRef, car);
    }

    // Función para agregar un coche a la galería
    function addCarToGallery(name, image, description, carUserId, carId) {
        const newCar = document.createElement('div');
        newCar.classList.add('car-item');
        newCar.setAttribute('data-user-id', carUserId);
        newCar.setAttribute('data-id', carId);

        const carImageElement = document.createElement('img');
        carImageElement.src = image;
        carImageElement.alt = name;
        newCar.appendChild(carImageElement);

        const carInfo = document.createElement('div');
        carInfo.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
        newCar.appendChild(carInfo);

        // Crear botón de eliminación solo si el coche pertenece al usuario actual
        if (carUserId === userId) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function () {
                carGallery.removeChild(newCar);
                remove(ref(database, 'cars/' + carId));
            });
            newCar.appendChild(deleteButton);
        }

        carGallery.appendChild(newCar);
    }

    // Cargar coches al cargar la página
    loadCars();

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const carName = document.getElementById('car-name').value;
            const carImage = document.getElementById('car-image').files[0];
            const carDescription = document.getElementById('car-description').value;
            const carId = 'car-' + Date.now(); // Generar un identificador único para cada coche

            const reader = new FileReader();
            reader.onload = function (e) {
                const carImageSrc = e.target.result;
                const car = {
                    name: carName,
                    image: carImageSrc,
                    description: carDescription,
                    userId: userId,
                    id: carId
                };
                addCarToGallery(carName, carImageSrc, carDescription, userId, carId);
                saveCar(car);
                form.reset();
            };
            reader.readAsDataURL(carImage);
        });
    } else {
        console.error('Formulario no encontrado');
    }
});