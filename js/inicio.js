// Header "contacto" deja de ser sticky
const stickyElement = document.getElementById("divContacto");

// Convierte 1200px a vh (ejemplo: si 1vh = 10px, entonces 1200px = 120vh)
const scrollLimitVH = 150; // Ajusta este valor según lo necesites

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

// Función para cargar y mostrar los productos más clickeados
async function cargarProductos() {
  const productosRef = firebase.firestore().collection("productos");

  // Determinar la cantidad de productos según el ancho de la pantalla
  const limiteProductos = window.innerWidth < 768 ? 2 : 3;

  try {
    // Ordenar por el campo "clicks" de forma descendente y limitar según el tamaño de la pantalla
    const snapshot = await productosRef
      .orderBy("clicks", "desc")
      .limit(limiteProductos)
      .get();

    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de insertar nuevos productos

    let modalHTML = ""; // Para acumular los modales y evitar múltiples inserciones en el DOM
    let index = 0; // Contador manual para los índices

    snapshot.forEach((doc) => {
      const producto = doc.data();
      const modalId = `imageModal${index}`; // Generar un ID único para cada modal

      // Plantilla HTML para cada producto
      const productoHTML = `
              <div class="card producto">
                  <img
                      src="${producto.imagen1}"
                      class="card-img-top"
                      alt="${producto.titulo}"
                  />
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
                  <button
                    type="button"
                    class="btn btn-sm btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#${modalId}"
                  >
                    Ver más
                  </button>
                </div>
              </div>
            </div>`;

      // Crear el modal correspondiente a este producto
      modalHTML += `
              <div
                  class="modal fade modalProductos"
                  id="${modalId}"
                  tabindex="-1"
                  aria-labelledby="imageModalLabel${index}"
                  aria-hidden="true"
              >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="imageModalLabel${index}">
                      ${producto.titulo}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Cerrar"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <img
                      id="imagenPrincipal${index}"
                      src="${producto.imagen1}"
                      class="img-fluid mb-3"
                      alt="Imagen del producto"
                    />
                    <p>${producto.descripcion}</p>
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
              </div>
            </div>`;

      contenedorProductos.innerHTML += productoHTML; // Insertar los productos
      index++; // Incrementar el contador manual
    });

    document.body.insertAdjacentHTML("beforeend", modalHTML); // Insertar los modales al final del body
  } catch (error) {
    console.error("Error al cargar los productos: ", error);
  }
}

// Escuchar cambios en el tamaño de la pantalla y recargar los productos
window.addEventListener("resize", () => {
  cargarProductos();
});

// Inicializar los eventos en miniaturas al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
});
