// Header "contacto" deja de ser sticky
const stickyElement = document.getElementById("divContacto");

// Convierte 1200px a vh (ejemplo: si 1vh = 10px, entonces 1200px = 120vh)
const scrollLimitVH = 20; // Ajusta este valor según lo necesites

window.addEventListener("scroll", () => {
  if (window.scrollY > (scrollLimitVH * window.innerHeight) / 100) {
    stickyElement.classList.add("hidden"); // Ocultar suavemente
  } else {
    stickyElement.classList.remove("hidden"); // Mostrar suavemente
  }
});
