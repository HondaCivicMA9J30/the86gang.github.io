// Agregar funciones aquí si es necesario, por ejemplo para subir y mostrar coches
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('car-form');
    const carGallery = document.getElementById('car-gallery');

    // Generar un identificador único para el usuario si no existe
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', 'user-' + Date.now());
    }
    const userId = localStorage.getItem('userId');

    // Función para cargar coches desde localStorage
    function loadCars() {
        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        cars.forEach(car => {
            addCarToGallery(car.name, car.image, car.description, car.userId, car.id);
        });
    }

    // Función para guardar coches en localStorage
    function saveCars() {
        const cars = [];
        carGallery.querySelectorAll('.car-item').forEach(carItem => {
            const carName = carItem.querySelector('h3').textContent;
            const carImage = carItem.querySelector('img').src;
            const carDescription = carItem.querySelector('p').textContent;
            const carUserId = carItem.getAttribute('data-user-id');
            const carId = carItem.getAttribute('data-id');
            cars.push({ name: carName, image: carImage, description: carDescription, userId: carUserId, id: carId });
        });
        localStorage.setItem('cars', JSON.stringify(cars));
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
                saveCars();
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
                addCarToGallery(carName, carImageSrc, carDescription, userId, carId);
                saveCars();
                form.reset();
            };
            reader.readAsDataURL(carImage);
        });
    } else {
        console.error('Formulario no encontrado');
    }
});