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
const auth = firebase.auth();

// Aquí consultas a Firestore

//Chequear si el usuario es ADMIN

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // El usuario está autenticado
    checkUserRole(user); // Llamar a tu función para verificar el rol
  } else {
    // No hay usuario autenticado, redirigir al inicio de sesión
    window.location.href = "../index.html"; // Redirige a la página de inicio de sesión
  }
});

function checkUserRole(user) {
  // Referencia al documento del usuario en Firestore
  const userRef = firebase.firestore().collection("usuarios").doc(user.uid);

  // Verificar si el usuario tiene el rol 'admin'
  userRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData.role === "admin") {
        } else {
          // Si no es admin, mostrar un mensaje y cerrar sesión
          alert("No tienes permisos para acceder a esta página.");
          firebase.auth().signOut(); // Cerrar sesión
        }
      } else {
        // Si no existe el documento, cerrar sesión
        alert("Usuario no registrado en la base de datos.");
        firebase.auth().signOut(); // Cerrar sesión
      }
    })
    .catch((error) => {
      console.error("Error al verificar el rol del usuario: ", error);
      alert("Error al verificar el rol del usuario.");
      firebase.auth().signOut(); // Cerrar sesión en caso de error
    });
}

//Incio de Sección Productos

mensajeDeProducto = document.getElementById("mensajeDeProducto");

const formProducto = document.getElementById("productoACargar");

formProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("tituloACargarProducto").value;
  const precio = document.getElementById("precioACargarProducto").value;
  const descripcion = document.getElementById("descripcionProducto").value;
  const imagen = document.getElementById("imagenProducto").files[0];

  if (!imagen) {
    alert("Debes seleccionar una imagen para el producto.");
    return;
  }

  const productosRef = firebase.firestore().collection("productos");
  const storageRef = firebase.storage().ref();

  try {
    const nombreImagen = `productos/${Date.now()}_${imagen.name}`;
    const snapshot = await storageRef.child(nombreImagen).put(imagen);
    const imagenURL = await snapshot.ref.getDownloadURL();

    await productosRef.add({
      titulo,
      precio,
      descripcion,
      imagen1: imagenURL,
    });

    mensajeDeProducto.innerHTML = "Producto guardado exitosamente.";
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  } catch (error) {
    mensajeDeProducto.innerHTML = `Error: ${error.message}`;
  }
});

// Submit del formulario de modificación
document
  .getElementById("formModificarProducto")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!confirm("¿Estás seguro de que querés modificar este producto?"))
      return;

    const docId = document.getElementById("docIdProducto").value;
    const titulo = document.getElementById("tituloModificar").value;
    const precio = document.getElementById("precioModificar").value;
    const descripcion = document.getElementById("descripcionModificar").value;
    const nuevaImagen = document.getElementById("imagenModificar1").files[0];
    const eliminarImagen = document.getElementById("eliminarImagen1").checked;

    const productosRef = firebase
      .firestore()
      .collection("productos")
      .doc(docId);
    const storageRef = firebase.storage().ref();

    try {
      const doc = await productosRef.get();
      const data = doc.data();
      let imagen1URL = data.imagen1 || "";

      if (eliminarImagen && imagen1URL) {
        const path = decodeURIComponent(
          new URL(imagen1URL).pathname.split("/o/")[1].split("?")[0]
        );
        await storageRef.child(path).delete();
        imagen1URL = "";
      }

      if (nuevaImagen) {
        if (imagen1URL) {
          const path = decodeURIComponent(
            new URL(imagen1URL).pathname.split("/o/")[1].split("?")[0]
          );
          await storageRef.child(path).delete();
        }

        const nombre = `productos/${Date.now()}_${nuevaImagen.name}`;
        const snapshot = await storageRef.child(nombre).put(nuevaImagen);
        imagen1URL = await snapshot.ref.getDownloadURL();
      }

      await productosRef.update({
        titulo,
        precio,
        descripcion,
        imagen1: imagen1URL,
      });

      alert("Producto modificado exitosamente.");
      window.location.reload();
    } catch (error) {
      alert("Error al modificar producto: " + error.message);
    }
  });

// Función para eliminar un producto por ID (nombre del documento)
async function eliminarProducto(idDocumento) {
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    const docRef = firebase
      .firestore()
      .collection("productos")
      .doc(idDocumento);
    const storageRef = firebase.storage().ref();

    try {
      const docSnap = await docRef.get();
      const data = docSnap.data();
      if (data.imagen1) {
        const path = decodeURIComponent(
          new URL(data.imagen1).pathname.split("/o/")[1].split("?")[0]
        );
        await storageRef.child(path).delete();
      }

      await docRef.delete();
      alert("Producto eliminado correctamente");
      window.location.reload();
    } catch (error) {
      alert("Error al eliminar el producto: " + error.message);
    }
  }
}

// Función para modificar un producto por ID (nombre del documento)
async function modificarProducto(docId) {
  const docRef = firebase.firestore().collection("productos").doc(docId);
  const docSnap = await docRef.get();

  if (docSnap.exists) {
    const data = docSnap.data();

    document.getElementById("docIdProducto").value = docId;
    document.getElementById("tituloModificar").value = data.titulo;
    document.getElementById("precioModificar").value = data.precio;
    document.getElementById("descripcionModificar").value = data.descripcion;

    const preview = document.getElementById("previewModificar1");
    if (data.imagen1) {
      preview.src = data.imagen1;
      preview.style.display = "inline-block";
    } else {
      preview.src = "";
      preview.style.display = "none";
    }

    document.getElementById("imagenModificar1").value = "";
    document.getElementById("eliminarImagen1").checked = false;

    const modal = new bootstrap.Modal(
      document.getElementById("modalModificarProducto")
    );
    modal.show();
  }
}

// Mostrar vista previa al seleccionar nuevas imágenes
document
  .getElementById("imagenModificar1")
  .addEventListener("change", function () {
    const file = this.files[0];
    const preview = document.getElementById("previewModificar1");

    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "inline-block";
    }
  });

// Función para cargar y mostrar los productos
async function cargarProductos() {
  const productosRef = firebase.firestore().collection("productos");

  try {
    const snapshot = await productosRef.get();
    const contenedorProductos = document.getElementById(
      "divContenedorProductos"
    );
    let modalHTML = "",
      index = 0;

    snapshot.forEach((doc) => {
      const producto = doc.data();
      const modalId = `imageModal${index}`;
      const docId = doc.id;

      contenedorProductos.innerHTML += `
        <div class="col-xl-2 col-lg-4 col-md-5 col-5 my-1 producto">
          <div class="d-flex flex-column align-items-center">
            <img src="${producto.imagen1}" alt="${producto.titulo}" class="mt-2 imagenProducto">
            <h4 class="mt-2">${producto.titulo}</h4>
            <p class="mt-1 text-center">${producto.descripcion}</p>
            <h5 class="mt-1">$${producto.precio}</h5>
            <div class="my-1 d-flex flex-column justify-content-center">
              <button type="button" class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#${modalId}">Ver más</button>
              <button type="button" class="btn btn-sm btn-success mt-2" onclick="modificarProducto('${docId}')">Modificar</button>
              <button type="button" class="btn btn-sm btn-danger mt-2" onclick="eliminarProducto('${docId}')">Eliminar</button>
            </div>
          </div>
        </div>
      `;

      modalHTML += `
        <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="imageModalLabel${index}" aria-hidden="true">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel${index}">${producto.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
              </div>
              <div class="modal-body text-center">
                <img src="${producto.imagen1}" class="img-fluid mb-2"><br>
              </div>
            </div>
          </div>
        </div>`;
      index++;
    });

    document.body.insertAdjacentHTML("beforeend", modalHTML);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// Inicializar los eventos en miniaturas al cargar el DOM
document.addEventListener("DOMContentLoaded", function () {
  cargarProductos();
});

// Función para cargar el formulario de modificación con los datos del producto
function cargarPreviewYListeners(data) {
  const preview = document.getElementById("previewModificar1");
  preview.src = data.imagen1 || "";

  document
    .getElementById("imagenModificar1")
    .addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        preview.src = URL.createObjectURL(file);
      }
    });

  // Guardar URL original para referencia (opcional)
  const urlsOriginales = {
    imagen1: data.imagen1 || "",
  };
  document.getElementById("formModificarProducto").dataset.originales =
    JSON.stringify(urlsOriginales);
}

// Sección carga y bajas de Admin

// Escuchar el evento de submit en el formulario

document
  .getElementById("adminACargar")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const mail = document.getElementById("mailAdmin").value;
    const action = e.submitter.value; // Captura qué botón fue presionado

    // Referencia a la colección de usuarios en Firestore
    const usuariosRef = firebase.firestore().collection("usuarios");

    try {
      // Obtener el documento del usuario basado en el email
      const querySnapshot = await usuariosRef.where("email", "==", mail).get();

      if (!querySnapshot.empty) {
        // Asumimos que los emails son únicos y solo hay un documento por email
        const userDoc = querySnapshot.docs[0];

        if (action === "agregarAdmin") {
          // Actualizar el rol a "admin"
          await userDoc.ref.update({ role: "admin" });
          alert("Rol cambiado a Admin");
        } else if (action === "quitarAdmin") {
          // Actualizar el rol a "user"
          await userDoc.ref.update({ role: "user" });
          alert("Rol cambiado a User");
        }
      } else {
        alert("No se encontró un usuario con ese correo.");
      }
    } catch (error) {
      console.error("Error al actualizar el rol: ", error);
    }
  });
