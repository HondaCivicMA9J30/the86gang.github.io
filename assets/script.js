// Agregar funciones aquí si es necesario, por ejemplo para subir y mostrar coches
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('car-form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            const carName = document.getElementById('car-name').value;
            const carImage = document.getElementById('car-image').files[0];
            const carDescription = document.getElementById('car-description').value;

            const carGallery = document.getElementById('car-gallery');
            const newCar = document.createElement('div');
            newCar.classList.add('car-item');

            const carImageElement = document.createElement('img');
            carImageElement.src = URL.createObjectURL(carImage);
            carImageElement.alt = carName;
            newCar.appendChild(carImageElement);

            const carInfo = document.createElement('div');
            carInfo.innerHTML = `<h3>${carName}</h3><p>${carDescription}</p>`;
            newCar.appendChild(carInfo);

            // Crear botón de eliminación
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', function () {
                carGallery.removeChild(newCar);
            });
            newCar.appendChild(deleteButton);

            carGallery.appendChild(newCar);

            form.reset();
        });
    } else {
        console.error('Formulario no encontrado');
    }
});