// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove, push } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGSY-CKYrlV_ukEtMs9pqMj4uIAbIb2lo",
  authDomain: "the-86-gang.firebaseapp.com",
  databaseURL: "https://the-86-gang-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "the-86-gang",
  storageBucket: "the-86-gang.appspot.com",
  messagingSenderId: "420976488314",
  appId: "1:420976488314:web:34570c0b3a8baaf55cb0c3",
  measurementId: "G-H50V831HW4"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('car-form');
    const carGallery = document.getElementById('car-gallery');

    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', 'user-' + Date.now());
    }
    const userId = localStorage.getItem('userId');

    function loadCars() {
        const carsRef = ref(database, 'cars');
        onValue(carsRef, (snapshot) => {
            carGallery.innerHTML = '';
            const cars = snapshot.val();
            for (let id in cars) {
                const car = cars[id];
                addCarToGallery(car.name, car.image, car.description, car.userId, id);
            }
        });
    }

    function saveCar(car, imageFile) {
        const newCarRef = push(ref(database, 'cars'));
        const carId = newCarRef.key;
        const imageStorageRef = storageRef(storage, `cars/${carId}`);
        
        uploadBytes(imageStorageRef, imageFile).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                car.image = downloadURL;
                set(newCarRef, car);
            });
        });
    }

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

        if (carUserId === userId) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function () {
                remove(ref(database, 'cars/' + carId));
                carGallery.removeChild(newCar);
            });
            newCar.appendChild(deleteButton);
        }

        carGallery.appendChild(newCar);
    }

    loadCars();

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const carName = document.getElementById('car-name').value;
            const carImage = document.getElementById('car-image').files[0];
            const carDescription = document.getElementById('car-description').value;
            const car = {
                name: carName,
                description: carDescription,
                userId: userId
            };
            saveCar(car, carImage);
            form.reset();
        });
    } else {
        console.error('Formulario no encontrado');
    }
});
