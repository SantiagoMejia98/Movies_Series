const elementos = {
  peliculas: document.querySelector('[data-name="peliculas"]'),
};

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = new Set();
let data = {};

function crearlistaInicio(elemento, datos) {
  const ulExistente = elemento.querySelector("ul");

  if (ulExistente) {
    elemento.removeChild(ulExistente);
  }

  const ul = document.createElement("ul");
  ul.className = "lista";

  datos.forEach((pelicula) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
                <div class="pelicula-container" id="${pelicula.Id}">
                    <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                    <img src="https://image.tmdb.org/t/p/original${pelicula.Poster}" alt="${pelicula.Nombre}">
                    <div class="informacion">
                        <p class="fecha">${pelicula.Lanzamiento}</p>
                        <p class="duracion">${pelicula.Duracion}</p>
                        <p class="hidden" id="tipo">${pelicula.Tipo}</p>
                    </div>
                </div>
            `;

    ul.appendChild(li);
  });

  elemento.appendChild(ul);
}

function manejarSeleccion(event) {
  const valorSeleccionado = event.target.value;
  let ruta;
  switch (valorSeleccionado) {
    case "seleccionar":
      ruta = "index.html";
      break;
    case "peliculas":
      ruta = "peliculas.html";
      break;
    case "series":
      ruta = "series.html";
      break;
    case "pelicula":
      ruta = "pelicula.html";
      break;
    case "serie":
      ruta = "serie.html";
      break;
    case "busqueda":
      ruta = "busqueda.html";
      break;
  }
  if (ruta) {
    window.location.href = ruta;
  } else {
    console.error("No se definió una ruta para la selección.");
  }
}

function guardarDatos() {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + EXPIRATION_DAYS);
  data["expirationDate"] = expirationDate;
  localStorage.setItem("datos", JSON.stringify(data));
}

async function cargarDatosGuardados() {
  const datos = localStorage.getItem("datos");
  data = JSON.parse(datos);
  todasLasPeliculas = new Set(data["peliculasCard"]);
  crearlistaInicio(elementos.peliculas, todasLasPeliculas);
}

await cargarDatosGuardados();

dropdownMenu.addEventListener("change", manejarSeleccion);
