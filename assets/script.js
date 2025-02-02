// Agregar funciones aquí si es necesario, por ejemplo para subir y mostrar coches
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('car-form');
    const carGallery = document.getElementById('car-gallery');

    // Función para cargar coches desde localStorage
    function loadCars() {
        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        cars.forEach(car => {
            addCarToGallery(car.name, car.image, car.description);
        });
    }

    // Función para guardar coches en localStorage
    function saveCars() {
        const cars = [];
        carGallery.querySelectorAll('.car-item').forEach(carItem => {
            const carName = carItem.querySelector('h3').textContent;
            const carImage = carItem.querySelector('img').src;
            const carDescription = carItem.querySelector('p').textContent;
            cars.push({ name: carName, image: carImage, description: carDescription });
        });
        localStorage.setItem('cars', JSON.stringify(cars));
    }

    // Función para agregar un coche a la galería
    function addCarToGallery(name, image, description) {
        const newCar = document.createElement('div');
        newCar.classList.add('car-item');

        const carImageElement = document.createElement('img');
        carImageElement.src = image;
        carImageElement.alt = name;
        newCar.appendChild(carImageElement);

        const carInfo = document.createElement('div');
        carInfo.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
        newCar.appendChild(carInfo);

        // Crear botón de eliminación
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', function () {
            carGallery.removeChild(newCar);
            saveCars();
        });
        newCar.appendChild(deleteButton);

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

            const reader = new FileReader();
            reader.onload = function (e) {
                const carImageSrc = e.target.result;
                addCarToGallery(carName, carImageSrc, carDescription);
                saveCars();
                form.reset();
            };
            reader.readAsDataURL(carImage);
        });
    } else {
        console.error('Formulario no encontrado');
    }
});