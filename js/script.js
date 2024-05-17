
function toggleResponsive() {
    var header = document.querySelector('.header');
    header.classList.toggle('responsive');
}


/* DOM PRECIOS TITULOS */
function agregarAlCarrito(button) {
    const titulo = button.parentNode.querySelector('.titulo-libro').textContent;
    const precio = parseFloat(button.parentNode.querySelector('.precio').textContent.replace('$', '').replace(',', ''));
    const imagen = button.parentNode.querySelector('img').src; // Captura la URL de la imagen del libro

    let libroExistenteIndex = carrito.findIndex(item => item.nombre === titulo);

    if (libroExistenteIndex !== -1) {
        carrito[libroExistenteIndex].cantidad++;
    } else {
        carrito.push({ nombre: titulo, precio: precio, cantidad: 1, imagen: imagen }); // Almacena la URL de la imagen del libro en el objeto del carrito
    }
    mostrarCarrito();
    actualizarCantidadCarrito();
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
const carritoSidebar = document.getElementById("carrito-sidebar");
const closeButton = document.querySelector(".close");

carritoNav.addEventListener("click", () => {
    carritoSidebar.style.width = "calc(25% - 40px)";
});

closeButton.addEventListener("click", () => {
    carritoSidebar.style.width = "0";
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
    let cantidadCarrito = 0;
    carrito.forEach(item => cantidadCarrito += item.cantidad);
    document.getElementById("cantidad-carrito").textContent = cantidadCarrito;

    // Si la cantidad del carrito es mayor que 0, abre el carrito
    if (cantidadCarrito > 0) {
        abrirCarrito();
    } else {
        cerrarCarrito();
    }
}
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
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
    carritoElemento.innerHTML = ""; // Limpiar el contenido anterior del carrito

    if (carrito.length === 0) {
        carritoElemento.innerHTML = "<p class='texto-carrito'>No hay elementos en el carrito</p>";
        document.getElementById("subtotal-total").innerHTML = ""; // Limpiar el subtotal si no hay elementos en el carrito
        return;
    }

    let subtotal = 0;
    carrito.forEach((item, index) => {
        subtotal += item.precio * item.cantidad;
        carritoElemento.innerHTML += `<div class='item-carrito'>
        <img src='${item.imagen}' class='img-libro'> <!-- Muestra la imagen del libro -->
        <div class='item-carrito-info'>
            <p class='titulo-libro carrito-detalle'>${item.nombre}</p>
            <p class='subtotal-libro carrito-detalle'>$${item.precio * item.cantidad}</p> <!-- Subtotal -->

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
    document.getElementById("subtotal-total").innerHTML = `
                                                        <p>TOTAL: $${total.toFixed(2)}</p>`;
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

botonFinalizar.addEventListener('click', function() {
window.location.href = 'finalizar.html';
});

