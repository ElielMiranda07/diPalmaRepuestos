// Header "contacto" deja de ser sticky
const stickyElement = document.getElementById("divContacto");

// Convierte 1200px a vh (ejemplo: si 1vh = 10px, entonces 1200px = 120vh)
const scrollLimitVH = 90; // Ajusta este valor según lo necesites

window.addEventListener("scroll", () => {
  if (window.scrollY > (scrollLimitVH * window.innerHeight) / 100) {
    stickyElement.classList.add("hidden"); // Ocultar suavemente
  } else {
    stickyElement.classList.remove("hidden"); // Mostrar suavemente
  }
});

// Configura Firebase normalmente
const firebaseConfig = {
  apiKey: "AIzaSyDrA7O9ld2wkBTm6TsLxqbZsaNvi7sbZXQ",
  authDomain: "dipalmarepuestos.firebaseapp.com",
  projectId: "dipalmarepuestos",
  storageBucket: "dipalmarepuestos.firebasestorage.app",
  messagingSenderId: "64089234971",
  appId: "1:64089234971:web:22549fa20b1512876a22be",
  measurementId: "G-DQ5XHWZN08",
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Aquí puedes hacer consultas a Firestore

// Variables globales para paginación
let productos = [];
let productosFiltrados = [];
let paginaActual = 1;
let filtroCategoria = "todas";

let productosPorPagina;

if (window.innerWidth < 768) {
  productosPorPagina = 8;
} else {
  productosPorPagina = 12;
}

// Función para cargar y mostrar productos con paginación, ordenados por 'clicks'
async function cargarProductos() {
  const productosRef = firebase
    .firestore()
    .collection("productos")
    .orderBy("clicks", "desc"); // Ordenar por clicks descendente

  try {
    const snapshot = await productosRef.get();
    productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    productosFiltrados = [...productos]; // Inicialmente, los filtrados son todos
    actualizarPaginacion();
  } catch (error) {
    console.error("Error al cargar los productos: ", error);
  }
}

function mostrarProductos() {
  const contenedorProductos = document.getElementById("contenedorProductos");
  const contenedorModales = document.getElementById("contenedorModales"); // Contenedor donde se agregarán los modales
  contenedorProductos.innerHTML = "";
  contenedorModales.innerHTML = "";

  const inicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(
    inicio,
    inicio + productosPorPagina
  );

  productosPagina.forEach((producto, index) => {
    const modalId = `imageModal${inicio + index}`;

    // Crear la tarjeta del producto
    const divProducto = document.createElement("div");
    divProducto.classList.add(
      "d-flex",
      "justify-content-center",
      "col-md-4",
      "col-6",
      "mb-4",
      "p-0",
      "producto"
    );
    divProducto.setAttribute("data-nombre", producto.titulo.toLowerCase());
    divProducto.innerHTML = `
      <div class="card d-flex flex-column align-items-center justify-content-center">
        <img src="${producto.imagen1}" class="card-img-top" alt="${producto.titulo}" />
        <div class="card-body">
          <h5 class="card-title text-center">${producto.titulo}</h5>
          <div class="col d-flex justify-content-center mb-2 divContactoRepuesto">
            <a
              href="https://wa.me/5492346465005?text=Hola,%20quer%C3%ADa%20consultar%20por%20el%20repuesto%20${producto.titulo}"
              target="_blank"
              rel="noopener noreferrer"
              class="d-flex flex-row align-items-center justify-content-between cardConsultar"
            >
              <span class="icon-hover d-flex align-items-center">
                <iconify-icon icon="logos:whatsapp-icon"></iconify-icon>
              </span>
              <p class="mb-0 me-1">
                Consultar
              </p>
            </a>
          </div>
          <div class="d-flex justify-content-center">
            <button type="button" class="btn btn-sm btn-danger botonVerMas" data-id="${producto.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">Ver más</button>
          </div>
        </div>
      </div>`;

    contenedorProductos.appendChild(divProducto);

    // Crear el modal correspondiente al producto
    const divModal = document.createElement("div");
    divModal.classList.add("modal", "fade");
    divModal.id = modalId;
    divModal.setAttribute("tabindex", "-1");
    divModal.setAttribute("aria-labelledby", `${modalId}Label`);
    divModal.setAttribute("aria-hidden", "true");
    divModal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="${modalId}Label">${producto.titulo}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img src="${producto.imagen1}" class="img-fluid" alt="Imagen del producto">
            <p>${producto.descripcion}</p>
          </div>
          <div class="modal-footer d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-sm btn-danger"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>`;

    contenedorModales.appendChild(divModal);
  });

  actualizarPaginacion();
}

// Función para actualizar la paginación
function actualizarPaginacion() {
  const paginacionContenedor = document.getElementById("paginacion");
  paginacionContenedor.innerHTML = "";

  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );
  if (totalPaginas <= 1) return;

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.classList.add("btn", "btn-sm", "btn-danger", "mx-1");
    btn.textContent = i;

    // Si es la página actual → activo
    if (i === paginaActual) {
      btn.classList.add("filtroActivo");
    }

    btn.addEventListener("click", () => {
      paginaActual = i;
      mostrarProductos(); // vuelve a renderizar y aplica el filtroActivo al botón correcto
    });

    paginacionContenedor.appendChild(btn);

    btn.addEventListener("click", () => {
      paginaActual = i;
      mostrarProductos();
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll suave hasta arriba
    });
  }
}
/*
btn.addEventListener("click", () => {
  paginaActual = i;
  mostrarProductos();
  window.scrollTo({ top: 0, behavior: "smooth" }); // scroll suave hasta arriba
});
*/
// Función para filtrar productos
function filtrarProductos(categoria = filtroCategoria) {
  filtroCategoria = categoria; // Guardamos la categoría activa
  const textoBusqueda = document
    .getElementById("barraBusqueda")
    .value.trim()
    .toLowerCase();

  productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda = producto.titulo
      .toLowerCase()
      .includes(textoBusqueda);

    const coincideCategoria =
      filtroCategoria === "todas" ||
      (producto.categoria && producto.categoria === filtroCategoria);

    return coincideBusqueda && coincideCategoria;
  });

  paginaActual = 1;
  mostrarProductos();
}

// Evento de búsqueda
const barraBusqueda = document.getElementById("barraBusqueda");
barraBusqueda.addEventListener("input", () => filtrarProductos());

function activarBoton(boton) {
  // Quitar filtroActivo de todos los botones de categoría
  document
    .querySelectorAll(".filtroCategoria")
    .forEach((b) => b.classList.remove("filtroActivo"));

  // Agregarlo solo al botón clickeado
  boton.classList.add("filtroActivo");
}

// Inicializar carga de productos
document.addEventListener("DOMContentLoaded", cargarProductos);

// Función para cargar y mostrar productos con paginación
async function cargarProductos() {
  const productosRef = firebase.firestore().collection("productos");

  try {
    const snapshot = await productosRef.get();
    productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    productosFiltrados = [...productos]; // Inicialmente, los filtrados son todos
    paginaActual = 1; // Asegurar que la primera página esté activa
    mostrarProductos(); // Mostrar los productos inmediatamente
  } catch (error) {
    console.error("Error al cargar los productos: ", error);
  }
}

// Manejar apertura y cierre de modales

document.addEventListener("DOMContentLoaded", function () {
  // Escuchar cuando un modal se cierra
  document.querySelectorAll(".modalProductos").forEach((modal) => {
    modal.addEventListener("hidden.bs.modal", function () {
      // Quitar el aria-hidden que podría estar causando conflictos
      modal.setAttribute("aria-hidden", "false");
    });

    // Escuchar cuando un modal se abre
    modal.addEventListener("shown.bs.modal", function () {
      // Asegurar que el modal tenga el foco
      modal.querySelector(".btn-close").focus();
    });
  });
});

// Escuchar clics en los botones "Ver más"
document.addEventListener("click", async function (event) {
  // Verificar si el clic ocurrió en un botón con la clase 'botonVerMas'
  if (event.target.classList.contains("botonVerMas")) {
    const boton = event.target;
    const productoId = boton.getAttribute("data-id"); // Obtener el ID del producto
    console.log(
      `Intentando incrementar clicks para el producto con ID: ${productoId}`
    );

    try {
      // Referencia al documento del producto
      const productoRef = firebase
        .firestore()
        .collection("productos")
        .doc(productoId);

      // Obtener el documento actual
      const doc = await productoRef.get();
      if (!doc.exists) {
        console.error(`El producto con ID: ${productoId} no existe.`);
        return;
      }

      // Mostrar los datos actuales del producto
      const productoData = doc.data();
      console.log("Producto actual:", productoData);

      // Incrementar el campo 'clicks' (si no existe, se inicializa en 1)
      await productoRef.update({
        clicks: firebase.firestore.FieldValue.increment(1),
      });

      console.log(
        `Clicks incrementados correctamente para el producto con ID: ${productoId}`
      );
    } catch (error) {
      console.error("Error al incrementar los clicks: ", error);
    }
  }
});
