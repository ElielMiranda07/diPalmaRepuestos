// Header "contacto" deja de ser sticky
const stickyElement = document.getElementById("divContacto");

window.addEventListener("scroll", () => {
  if (window.scrollY > 1200) {
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

// Función para cargar y mostrar los 3 productos más clickeados
async function cargarProductos() {
  const productosRef = firebase.firestore().collection("productos");

  try {
    // Ordenar por el campo "clicks" de forma descendente y limitar a 3 resultados
    const snapshot = await productosRef
      .orderBy("clicks", "desc")
      .limit(3)
      .get();
    const contenedorProductos = document.getElementById("contenedorProductos");

    let modalHTML = ""; // Para acumular los modales y evitar múltiples inserciones en el DOM
    let index = 0; // Contador manual para los índices

    snapshot.forEach((doc) => {
      const producto = doc.data();
      const modalId = `imageModal${index}`; // Generar un ID único para cada modal

      // Plantilla HTML para cada producto
      const productoHTML = `
              <div class="card" style="width: 18rem">
                  <img
                      src="${producto.imagen}"
                      class="card-img-top"
                      alt="Imagen del producto"
                  />
                  <div class="card-body">
                      <h5 class="card-title text-center">${producto.titulo}</h5>
                      <p class="card-text text-center">
                          ${producto.descripcion}
                      </p>
                      <p class="card-text text-center">
                          <strong>Precio:</strong> $${producto.precio}
                      </p>
                  <div class="d-flex justify-content-center">
                  <button
                    type="button"
                    class="btn btn-danger"
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
                      src="${producto.imagen}"
                      class="img-fluid mb-3"
                      alt="Imagen del producto"
                    />
                    <p>${producto.descripcion}</p>
                    <p><strong>Precio:</strong>$${producto.precio}</p>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
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

// Inicializar los eventos en miniaturas al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
});
