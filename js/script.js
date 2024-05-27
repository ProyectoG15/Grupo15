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
       var alerta = document.getElementById("alerta");
       alerta.style.display = "block";
       
    
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


function actualizarCantidadCarrito() {
    const carritoNav = document.getElementById("carrito-nav");
    const cantidadTotal = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    carritoNav.setAttribute("data-count", cantidadTotal);
}


function eliminarDelCarrito(index) {
    const itemCarrito = document.querySelectorAll('.item-carrito')[index];
    itemCarrito.classList.add('slide-out');

    itemCarrito.addEventListener('animationend', () => {
        itemCarrito.remove();

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
    carritoSidebar.classList.add("open"); 
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
                <button class="button ver-mas" data-book-id="${book.id}" style="margin: auto; left: 0.625rem; height: 50px; width: 90px">+ info</button>
                <button class="button" onclick="agregarAlCarrito(this)"><i class="fas fa-shopping-cart"></i></button>
            </div>
        `;

        booksContainer.appendChild(bookElement);
    });

    const verMasButtons = document.querySelectorAll('.ver-mas');
    verMasButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookId = button.getAttribute('data-book-id');
            verDetalle(bookId);
        });
    });
}



function verDetalle(bookId) {
    const apiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const libro = data.volumeInfo;

            document.getElementById('catalogo-titulo').textContent = libro.title;
            document.getElementById('catalogo-autor').textContent = `Autor: ${libro.authors ? libro.authors.join(', ') : 'Desconocido'}`;
            
            const descripcion = libro.description ? libro.description.replace(/<\/?p>/g, '') : 'Descripción no disponible';
            document.getElementById('catalogo-descripcion').textContent = `Descripción: ${descripcion}`;
            
            const imagen = libro.imageLinks ? libro.imageLinks.thumbnail : './Imagenes/default-book.png';
            document.getElementById('catalogo-imagen').src = imagen;
            
            const modal = document.getElementById('catalogo-modal');
            modal.style.display = 'block';
        })
        .catch(error => console.error('Error al obtener detalles del libro:', error));


}


fetchBooks();

setTimeout(function() {
    document.getElementById("loader-container").style.display = "none";
    document.getElementById("books-container").style.display = "block";
}, 4000); 

var loginModal = document.getElementById('login-modal');

var userButton = document.querySelector('.nav-derecho a[href="#"]');

userButton.onclick = function() {
  loginModal.style.display = "block";
}

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

    if (localStorage.getItem('loggedIn') === 'true') {
        alert('Ya has iniciado sesión como ' + localStorage.getItem('username'));
    }
});
/*REGISTRARSE* */

document.getElementById('registerButton').onclick = function() {
    document.getElementById('register-modal').style.display = 'block';
}

document.getElementById('sucursales-link').addEventListener('click', function (e) {
    e.preventDefault();
    var iframeContainer = document.getElementById('iframe-container');
    var sucursalesLink = document.getElementById('sucursales-link');
    
    sucursalesLink.classList.toggle('active');
    
    if (iframeContainer.style.display === 'none' || iframeContainer.style.display === '') {
        iframeContainer.style.display = 'block';
    } else {
        iframeContainer.style.display = 'none';
    }
});

async function obtenerLibrosMasVendidos() {
    const consultas = [
        'más vendidos', 'best sellers', 'más vendidos', 'libros populares'
    ];

    let librosMasVendidos = [];

    for (const consulta of consultas) {
        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${consulta}`;
        try {
            const respuesta = await fetch(apiUrl);
            const datos = await respuesta.json();
            librosMasVendidos = [...librosMasVendidos, ...datos.items];
        } catch (error) {
            console.error('Error al obtener los libros más vendidos:', error);
        }
    }

    const distintivo = 'Nuevo'; // Texto del distintivo "Nuevo"

    // Filtrar los libros que tienen información de venta y un precio mayor que cero
    const librosAMostrar = librosMasVendidos.filter(libro => {
        return libro.saleInfo && libro.saleInfo.listPrice && libro.saleInfo.listPrice.amount > 0;
    }).slice(0, 5); // Limitar a 5 libros

    // Agregar el distintivo "Nuevo" a cada libro
    librosAMostrar.forEach(libro => {
        libro.distintivo = distintivo;
    });

    mostrarLibrosMasVendidos(librosAMostrar); // Mostrar los libros más vendidos en la interfaz
}

function mostrarLibrosMasVendidos(libros) {
    const contenedorLibros = document.getElementById('libros-mas-vendidos');
    contenedorLibros.innerHTML = '';

    libros.forEach(libro => {
        const infoLibro = libro.volumeInfo;
        const elementoLibro = document.createElement('div');
        elementoLibro.classList.add('book');


        const imagenLibro = infoLibro.imageLinks ? infoLibro.imageLinks.thumbnail : './Imagenes/default-book.png';
        const tituloLibro = infoLibro.title;
        const autorLibro = infoLibro.authors ? infoLibro.authors.join(', ') : 'Autor desconocido';
        const precioLibro = libro.saleInfo.listPrice ? `$${libro.saleInfo.listPrice.amount}` : 'Precio no disponible';

        elementoLibro.innerHTML = `
            <div class="libro">
                <img src="${imagenLibro}" alt="Portada del libro">
                <h3 class="titulo-libro">${tituloLibro}</h3>
                <p>${autorLibro}</p>
                <p class="precio">${precioLibro}</p>
                <button class="button ver-mas" data-book-id="${libro.id}" style="margin: auto; left: 0.625rem; height: 50px; width: 90px">+ info</button>
                <button class="button agregar-carrito" onclick="agregarAlCarrito(this)"><i class="fas fa-shopping-cart"></i></button>
            </div>
        `;

        contenedorLibros.appendChild(elementoLibro);
    });
}

// Llamar a la función para obtener y mostrar los libros más vendidos
obtenerLibrosMasVendidos();


