const elementos = {
  peliculas: document.querySelector('[data-name="peliculas"]'),
};

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = {};

let generos = {};
let actores = {};
let directores = {};

function crearlistaInicio(elemento, datos) {
  const ulExistente = elemento.querySelector("ul");

  if (ulExistente) {
    elemento.removeChild(ulExistente);
  }

  const ul = document.createElement("ul");
  ul.className = "lista";

  for (const pelicula of Object.values(datos)) {
    const li = document.createElement("li");
    li.className = "card";
    li.setAttribute("data-id", pelicula.Id);
    li.setAttribute("data-type", pelicula.Tipo);
    li.innerHTML = `
                <div class="pelicula-container">
                    <h2 class="titulo"><strong>${
                      pelicula.Nombre.split(" (")[0]
                    }</strong></h2>
                    <img src="https://image.tmdb.org/t/p/w500${
                      pelicula.Poster
                    }" alt="${pelicula.Nombre}">
                    <div class="informacion">
                        <p class="fecha">${pelicula.Lanzamiento}</p>
                        <p class="duracion">${pelicula.Duracion}</p>
                    </div>
                </div>
            `;

    ul.appendChild(li);
  }

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
    case "actualizar":
      ruta = "actualizar.html";
      break;
  }
  if (ruta) {
    window.location.href = ruta;
  } else {
    console.error("No se definió una ruta para la selección.");
  }
}

function guardarDatos(data) {
  localStorage.setItem("aleatorio", JSON.stringify(data));
}

async function cargarDatosGuardados() {
  todasLasPeliculas = JSON.parse(localStorage.getItem("peliculasCard"));
  crearlistaInicio(elementos.peliculas, todasLasPeliculas);
  generos = JSON.parse(localStorage.getItem("generos"));
  actores = JSON.parse(localStorage.getItem("actores"));
  directores = JSON.parse(localStorage.getItem("directores"));
}

await cargarDatosGuardados();

function desplegableGeneros() {
  const select = document.getElementById("generos");
  for (const [key, value] of Object.entries(generos)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value;
    select.appendChild(option);
  }
}

desplegableGeneros();

dropdownMenu.addEventListener("change", manejarSeleccion);

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const id = card.getAttribute("data-id");
  const aleatorio = [id];
  guardarDatos(aleatorio);
  window.location.href = "pelicula.html";
});

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const texto = buscador.value.trim().toLowerCase();

  if (texto === "") {
    crearlistaInicio(elementos.peliculas, todasLasPeliculas);
    return;
  }

  const peliculasFiltradas = Object.values(todasLasPeliculas).filter((p) =>
    p.Nombre.toLowerCase().includes(texto)
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
});

const seleccionarGenero = document.getElementById("generos");
seleccionarGenero.addEventListener("change", function () {
  const generoSeleccionado = seleccionarGenero.value;

  if (generoSeleccionado === "seleccionar") {
    crearlistaInicio(elementos.peliculas, todasLasPeliculas);
    crearlistaInicio(elementos.series, todasLasSeries);
    return;
  }

  const peliculasFiltradas = Object.values(todasLasPeliculas).filter((p) =>
    p.Generos.includes(parseInt(generoSeleccionado))
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
});

window.addEventListener("pageshow", () => {
  dropdownMenu.value = "peliculas";
  seleccionarGenero.value = "seleccionar";
  buscador.value = "";
  selectPlataforma.value = "seleccionar";
});
