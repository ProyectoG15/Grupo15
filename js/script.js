function agregarAlCarrito(button) {
    const titulo = button.parentNode.querySelector('.titulo-libro').textContent;
    const precio = parseFloat(button.parentNode.querySelector('.precio').textContent.replace('$', '').replace(',', ''));
    const imagen = button.parentNode.querySelector('img').src;

    let libroExistenteIndex = carrito.findIndex(item => item.nombre === titulo);

    if (libroExistenteIndex !== -1) {
        carrito[libroExistenteIndex].cantidad++;
    } else {
        carrito.push({ nombre: titulo, precio: precio, cantidad: 1, imagen: imagen });
    }
    mostrarCarrito();
    actualizarCantidadCarrito();
       // Mostrar la alerta
       var alerta = document.getElementById("alerta");
       alerta.style.display = "block";
       
   
       // Opcionalmente, puedes ocultar la alerta después de unos segundos
       setTimeout(function() {
           alerta.style.display = "none";
       }, 3000); // Oculta la alerta después de 3 segundos (3000 milisegundos)
}

/* DOM DINAMICO NAV */
document.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const navbar = document.querySelector('.header');

    if (window.scrollY > 0) {
        header.classList.add('sticky-header');
        navbar.style.backgroundColor = 'var(--color-secundario)';

    } else {
        header.classList.remove('sticky-header');
        navbar.style.backgroundColor = 'var(--color-principal)';
    }
});
let carrito = [];

const carritoNav = document.getElementById("carrito-nav");
const modalCarrito = document.getElementById("modal-carrito");
const closeModal = document.querySelector(".close");

carritoNav.addEventListener("click", () => {
    modalCarrito.style.display = "block";
    mostrarCarrito();
});

closeModal.addEventListener("click", () => {
    modalCarrito.style.display = "none";
});

window.addEventListener("click", (event) => {
    if (event.target === modalCarrito) {
        modalCarrito.style.display = "none";
    }
});


// Quitamos la llamada a abrirCarrito() del evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el carrito estaba abierto o cerrado al cargar la página anteriormente
    const carritoAbierto = localStorage.getItem("carritoAbierto");
    if (carritoAbierto === "true") {
        carritoSidebar.classList.add("open");
    } else {
        carritoSidebar.classList.remove("open");
    }
});

// Manejamos la apertura y el cierre del carrito en el evento de clic del icono del carrito
carritoNav.addEventListener("click", () => {
    if (carritoSidebar.classList.contains("open")) {
        carritoSidebar.classList.remove("open");
        localStorage.setItem("carritoAbierto", "false");
    } else {
        carritoSidebar.classList.add("open");
        localStorage.setItem("carritoAbierto", "true");
    }
});
// Función para abrir el carrito y guardar su estado en el almacenamiento local
function abrirCarrito() {
    if (window.innerWidth > 768) {
        carritoSidebar.classList.add("open");
        localStorage.setItem("carritoAbierto", "true");
    } else {
        carritoSidebar.classList.remove("open"); // Si la ventana es más pequeña que 768px, cierra el carrito
        localStorage.setItem("carritoAbierto", "false");
    }
}

// Función para cerrar el carrito y guardar su estado en el almacenamiento local
function cerrarCarrito() {
    carritoSidebar.classList.remove("open");
    localStorage.setItem("carritoAbierto", "false");
}

function actualizarCantidadCarrito() {
    // Aquí puedes actualizar el ícono del carrito en la navegación con el número de elementos
    const carritoNav = document.getElementById("carrito-nav");
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    carritoNav.setAttribute("data-count", cantidadTotal);
}


function eliminarDelCarrito(index) {
    const itemCarrito = document.querySelectorAll('.item-carrito')[index];
    itemCarrito.classList.add('slide-out');

    itemCarrito.addEventListener('animationend', () => {
        // Eliminar el elemento del DOM después de la animación
        itemCarrito.remove();

        // Aquí puedes añadir la lógica para actualizar tu carrito en el estado de tu aplicación
        // Por ejemplo, eliminando el elemento del array de items
        carrito.splice(index, 1);
        actualizarCarrito();
        
    });
}


function modificarCantidad(index, cantidad) {
    carrito[index].cantidad = cantidad;
    mostrarCarrito();
}

function aumentarCantidad(index) {
    carrito[index].cantidad++;
    mostrarCarrito();
}

function disminuirCantidad(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        mostrarCarrito();
    }
}

function mostrarCarrito() {
    let carritoElemento = document.getElementById("carrito-resumen");
    carritoElemento.innerHTML = "";

    if (carrito.length === 0) {
        carritoElemento.innerHTML = "<p class='texto-carrito'>No hay elementos en el carrito</p>";
        document.getElementById("subtotal-total").innerHTML = "$0.00";
        return;
    }

    let subtotal = 0;
    carrito.forEach((item, index) => {
        subtotal += item.precio * item.cantidad;
        carritoElemento.innerHTML += `<div class='item-carrito'>
        <img src='${item.imagen}' class='img-libro'>
        <div class='item-carrito-info'>
            <p class='titulo-libro carrito-detalle'>${item.nombre}</p>
            <p class='subtotal-libro carrito-detalle'>$${(item.precio * item.cantidad).toFixed(2)}</p>

            <div class='item-carrito-controls'>
                <button class="btn btn-sm coloresi" onclick="disminuirCantidad(${index})"><i class="fas fa-minus"></i></button>
                <input class='cantidad-libro input' type="number" min="1" value="${item.cantidad}" onchange="modificarCantidad(${index}, this.value)">
                <button class="btn btn-sm coloresi" onclick="aumentarCantidad(${index})"><i class="fas fa-plus"></i></button>
                <button class="btn btn-danger btn-sm eliminar" onclick="eliminarDelCarrito(${index})"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    </div>`;
    });


    let total = subtotal;
    document.getElementById("subtotal-total").innerHTML = `Total: $${total.toFixed(2)}`;
}

document.getElementById("carrito-nav").addEventListener("click", function () {
    let resumenCompra = document.getElementById("resumen-compra");
    if (resumenCompra.style.display === "none") {
        mostrarResumenCompra();
    } else {
        ocultarResumenCompra();
    }
});

function mostrarResumenCompra() {
    let resumenCompra = document.getElementById("resumen-compra");
    resumenCompra.style.display = "block";
}

function ocultarResumenCompra() {
    let resumenCompra = document.getElementById("resumen-compra");
    resumenCompra.style.display = "none";
}

carritoNav.addEventListener("click", () => {
    carritoSidebar.classList.add("open"); // Agrega la clase "open" al hacer clic en el enlace del carrito
});

// FINALIZAR COMPRA
const botonFinalizar = document.querySelector('.finalizar');

botonFinalizar.addEventListener('click', function () {
    window.location.href = 'finalizar.html';
});

function actualizarCantidadCarrito() {
    let cantidadCarrito = 0;
    carrito.forEach(item => cantidadCarrito += item.cantidad);
    document.getElementById("cantidad-carrito").textContent = cantidadCarrito;
}




async function fetchBooks() {
    const queries = [
        'python', 'programming',  
         'non-fiction',
        'fantasy', 'history', 'biography', 'mystery', 'romance', 'thriller'
    ];

    let allBooks = [];

    for (const query of queries) {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            allBooks = [...allBooks, ...data.items];
        } catch (error) {
            console.error('Error al obtener los libros:', error);
        }
    }

    displayBooks(allBooks);
}



function displayBooks(books) {
    const booksContainer = document.getElementById('books-container');
    booksContainer.innerHTML = '';

    const maxBooksToShow = 35;
    const booksToShow = books.filter(book => {
        return book.saleInfo && book.saleInfo.listPrice && book.saleInfo.listPrice.amount > 0;
    }).slice(0, maxBooksToShow);

    booksToShow.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookElement = document.createElement('div');
        bookElement.classList.add('book');

        const bookImage = bookInfo.imageLinks ? bookInfo.imageLinks.thumbnail : './Imagenes/default-book.png';
        const bookTitle = bookInfo.title;
        const bookAuthor = bookInfo.authors ? bookInfo.authors.join(', ') : 'Autor desconocido';
        const bookPrice = book.saleInfo.listPrice ? `$${book.saleInfo.listPrice.amount}` : 'Precio no disponible';

        bookElement.innerHTML = `
            <div class="libro">
                <img src="${bookImage}" alt="Portada del libro">
                <h3 class="titulo-libro">${bookTitle}</h3>
                <p>${bookAuthor}</p>
                <p class="precio">${bookPrice}</p>
                <button class="button ver-mas" data-book-id="${book.id}" style="margin: auto;">Ver más</button>
                <button class="button" onclick="agregarAlCarrito(this)"><i class="fas fa-shopping-cart"></i></button>
            </div>
        `;

        booksContainer.appendChild(bookElement);
    });

    // Agregar evento de clic a los botones "Ver más"
    const verMasButtons = document.querySelectorAll('.ver-mas');
    verMasButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = button.getAttribute('data-book-id');
            verDetalle(bookId);
        });
    });
}



function verDetalle(bookId) {
    // Obtener detalles del libro usando el ID
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Mostrar los detalles del libro en el contenedor
            const libro = data.volumeInfo;

            document.getElementById('titulo-libro').textContent = libro.title;
            document.getElementById('autor-libro').textContent = `Autor: ${libro.authors ? libro.authors.join(', ') : 'Desconocido'}`;
            
            // Eliminar las etiquetas <p> del texto de la descripción
            const descripcion = libro.description ? libro.description.replace(/<\/?p>/g, '') : 'Descripción no disponible';
            document.getElementById('descripcion-libro').textContent = `Descripción: ${descripcion}`;
            
            document.getElementById('precio-libro').textContent = `Precio: ${data.saleInfo && data.saleInfo.listPrice && data.saleInfo.listPrice.amount ? '$' + data.saleInfo.listPrice.amount : 'Precio no disponible'}`;
            
            // Mostrar la imagen del libro
            const imagen = libro.imageLinks ? libro.imageLinks.thumbnail : './Imagenes/default-book.png';
            document.getElementById('imagen-libro').src = imagen;
            
            // Mostrar el contenedor de detalles del libro
            document.getElementById('detalle-libro').style.display = 'block';
        })
        .catch(error => console.error('Error al obtener detalles del libro:', error));
        window.location.href = `detalle.html?bookId=${bookId}`;


}

// Redirección después de mostrar los detalles del libro
function redirigirADetalle() {
    const bookId = obtenerIdDelLibro(); // Función para obtener el ID del libro
    window.location.href = `detalle.html?bookId=${bookId}`;
}

fetchBooks();

setTimeout(function() {
    document.getElementById("loader-container").style.display = "none";
    document.getElementById("books-container").style.display = "block";
}, 4200); // 5000 milisegundos = 5 segundos

// Get the modal
var loginModal = document.getElementById('login-modal');

// Get the button that opens the modal
var userButton = document.querySelector('.nav-derecho a[href="#"]');

// When the user clicks the button, open the modal 
userButton.onclick = function() {
  loginModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
}
/*CLAVE*/
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('#loginForm');
    const loginButton = document.querySelector('#loginButton');
    const usernameInput = document.querySelector('#usua');
    const passwordInput = document.querySelector('#psw');
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const noSpecialCharRegex = /^[a-zA-Z0-9]*$/;

    const passwordNote = document.querySelector('#passwordNote');
    const passwordNotee = document.querySelector('#passwordNotee');
    const usuarioNote = document.querySelector('#usuarioNote');
    const usuarioNotee = document.querySelector('#usuarioNotee');

    function validateInput() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        let valid = true;

        // Validación de usuario
        if (!lowercaseRegex.test(username) || 
            !uppercaseRegex.test(username) || 
            !numberRegex.test(username) ||
            username.length < 8 || username.length > 16) {
            usuarioNote.classList.add('show');
            valid = false;
        } else {
            usuarioNote.classList.remove('show');
        }

        if (!noSpecialCharRegex.test(username)) {
            usuarioNotee.classList.add('show');
            valid = false;
        } else {
            usuarioNotee.classList.remove('show');
        }

        // Validación de contraseña
        if (!lowercaseRegex.test(password) || 
            !uppercaseRegex.test(password) || 
            !numberRegex.test(password) ||
            password.length < 8 || password.length > 16) {
            passwordNote.classList.add('show');
            valid = false;
        } else {
            passwordNote.classList.remove('show');
        }

        if (!noSpecialCharRegex.test(password)) {
            passwordNotee.classList.add('show');
            valid = false;
        } else {
            passwordNotee.classList.remove('show');
        }

        // Activar/Desactivar botón de ingresar
        if (valid) {
            loginButton.classList.remove('disabled');
            loginButton.disabled = false;
        } else {
            loginButton.classList.add('disabled');
            loginButton.disabled = true;
        }
    }

    usernameInput.addEventListener('input', validateInput);
    passwordInput.addEventListener('input', validateInput);

    loginButton.addEventListener('click', function() {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (loginButton.disabled === false) {
            localStorage.setItem('username', username);
            localStorage.setItem('loggedIn', true);
            alert('Sesión iniciada');
        }
    });

    // Verificar estado de la sesión al cargar la página
    if (localStorage.getItem('loggedIn') === 'true') {
        alert('Ya has iniciado sesión como ' + localStorage.getItem('username'));
    }
});
/*REGISTRARSE* */

document.getElementById('registerButton').onclick = function() {
    document.getElementById('register-modal').style.display = 'block';
}



