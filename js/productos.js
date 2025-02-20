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

// Función para cargar y mostrar todos los productos
async function cargarProductos() {
  const productosRef = firebase.firestore().collection("productos");

  try {
    // Obtener todos los productos sin limitarlos
    const snapshot = await productosRef.get();
    const contenedorProductos = document.getElementById("contenedorProductos");
    const barraBusqueda = document.getElementById("barraBusqueda");

    const fragmentoProductos = document.createDocumentFragment(); // Fragmento para productos
    const fragmentoModales = document.createDocumentFragment(); // Fragmento para modales

    let index = 0; // Contador manual para los índices

    snapshot.forEach((doc) => {
      const producto = { id: doc.id, ...doc.data() }; // Agregar el ID del documento al producto
      const modalId = `imageModal${index}`; // Generar un ID único para cada modal

      // Crear el contenedor del producto
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
        <div class="card">
          <img src="${producto.imagen1}" class="card-img-top" alt="Imagen del producto" />
          <div class="card-body">
            <h5 class="card-title text-center">${producto.titulo}</h5>
            <p class="card-text text-center">${producto.descripcion}</p>
            <p class="card-text text-center"><strong>Precio:</strong> $${producto.precio}</p>
            <div class="d-flex justify-content-center">
              <button type="button" class="btn btn-sm btn-danger botonVerMas" data-id="${producto.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">
                Ver más
              </button>
            </div>
          </div>
        </div>
      `;

      // Crear el modal correspondiente al producto
      const modal = document.createElement("div");
      modal.classList.add("modal", "fade", "modalProductos");
      modal.setAttribute("id", modalId);
      modal.setAttribute("tabindex", "-1");
      modal.setAttribute("aria-labelledby", `imageModalLabel${index}`);
      modal.setAttribute("aria-hidden", "true");

      modal.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="imageModalLabel${index}">${producto.titulo}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
              <img id="imagenPrincipal${index}" src="${producto.imagen1}" class="img-fluid mb-3" alt="Imagen del producto" />
              <p>${producto.descripcion}</p>
              <p><strong>Precio:</strong> $${producto.precio}</p>
            </div>
            <div class="modal-footer d-flex justify-content-center">
              <button type="button" class="btn btn-sm btn-danger" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      `;

      // Agregar el producto y el modal a los fragmentos
      fragmentoProductos.appendChild(divProducto);
      fragmentoModales.appendChild(modal);

      index++;
    });

    // Insertar los fragmentos en el DOM
    contenedorProductos.appendChild(fragmentoProductos);
    document.body.appendChild(fragmentoModales);

    // Filtrar productos al escribir en la barra de búsqueda
    barraBusqueda.addEventListener("input", function () {
      const textoBusqueda = barraBusqueda.value.trim().toLowerCase(); // Texto ingresado en la barra

      const productosFiltrados = document.querySelectorAll(".producto"); // Seleccionar todos los productos

      productosFiltrados.forEach((producto) => {
        const nombreProducto = producto.getAttribute("data-nombre"); // Atributo data-nombre

        if (nombreProducto.includes(textoBusqueda)) {
          producto.style.display = "block"; // Mostrar el producto
        } else {
          producto.setAttribute("style", "display: none !important;"); // Ocultar el producto
        }
      });
    });
  } catch (error) {
    console.error("Error al cargar los productos: ", error);
  }
}

// Inicializar los eventos en miniaturas al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
});

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
