const elementos = {
  peliculas: document.querySelector('[data-name="peliculas"]'),
  series: document.querySelector('[data-name="series"]'),
};

const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const EXPIRATION_DAYS = 30;

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasPeliculas = {};
let todasLasSeries = {};
let generos = {};
let actores = {};
let directores = {};
let proveedores = {};

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
  const fecha = JSON.parse(localStorage.getItem("expirationDate"));

  if (fecha && new Date(fecha) > new Date()) {
    todasLasPeliculas = JSON.parse(localStorage.getItem("peliculasCard"));
    todasLasSeries = JSON.parse(localStorage.getItem("seriesCard"));
    generos = JSON.parse(localStorage.getItem("generos"));
    actores = JSON.parse(localStorage.getItem("actores"));
    directores = JSON.parse(localStorage.getItem("directores"));
    proveedores = JSON.parse(localStorage.getItem("proveedores"));
  } else {
    window.location = "actualizar.html";
  }
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

function desplegableProveedores() {
  const select = document.getElementById("filtro-plataforma");
  for (const [key, value] of Object.entries(proveedores)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = value.Nombre;
    select.appendChild(option);
  }
}

desplegableProveedores();

crearlistaInicio(elementos.peliculas, todasLasPeliculas);
crearlistaInicio(elementos.series, todasLasSeries);

dropdownMenu.addEventListener("change", manejarSeleccion);

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const type = card.getAttribute("data-type");
  const id = card.getAttribute("data-id");
  const aleatorio = [id];
  guardarDatos(aleatorio);
  if (type === "tv") {
    window.location.href = "serie.html";
  } else {
    window.location.href = "pelicula.html";
  }
});

const buscador = document.getElementById("buscador");

buscador.addEventListener("input", function () {
  const texto = buscador.value.trim().toLowerCase();

  if (texto === "") {
    crearlistaInicio(elementos.peliculas, todasLasPeliculas);
    crearlistaInicio(elementos.series, todasLasSeries);
    return;
  }

  const peliculasFiltradas = Object.values(todasLasPeliculas).filter((p) =>
    p.Nombre.toLowerCase().includes(texto)
  );

  const seriesFiltradas = Object.values(todasLasSeries).filter((p) =>
    p.Nombre.toLowerCase().includes(texto)
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
  crearlistaInicio(elementos.series, seriesFiltradas);
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

  const seriesFiltradas = Object.values(todasLasSeries).filter((s) =>
    s.Generos.includes(parseInt(generoSeleccionado))
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
  crearlistaInicio(elementos.series, seriesFiltradas);
});

const selectPlataforma = document.getElementById("filtro-plataforma");

selectPlataforma.addEventListener("change", () => {
  const plataformaSeleccionada = selectPlataforma.value;

  if (plataformaSeleccionada === "seleccionar") {
    crearlistaInicio(elementos.peliculas, todasLasPeliculas);
    crearlistaInicio(elementos.series, todasLasSeries);
    return;
  }

  if (plataformaSeleccionada === "ninguno") {
    const peliculasFiltradas = Object.values(todasLasPeliculas).filter(
      (p) => p.Proveedores.length === 0
    );
    const seriesFiltradas = Object.values(todasLasSeries).filter(
      (s) => s.Proveedores.length === 0
    );
    crearlistaInicio(elementos.peliculas, peliculasFiltradas);
    crearlistaInicio(elementos.series, seriesFiltradas);
    return;
  }

  if (plataformaSeleccionada === "streaming") {
    const peliculasFiltradas = Object.values(todasLasPeliculas).filter(
      (p) => p.Proveedores.length > 0
    );
    const seriesFiltradas = Object.values(todasLasSeries).filter(
      (s) => s.Proveedores.length > 0
    );

    crearlistaInicio(elementos.peliculas, peliculasFiltradas);
    crearlistaInicio(elementos.series, seriesFiltradas);
    return;
  }

  const peliculasFiltradas = Object.values(todasLasPeliculas).filter((p) =>
    p.Proveedores.includes(parseInt(plataformaSeleccionada))
  );

  const seriesFiltradas = Object.values(todasLasSeries).filter((s) =>
    s.Proveedores.includes(parseInt(plataformaSeleccionada))
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
  crearlistaInicio(elementos.series, seriesFiltradas);
});

window.addEventListener("pageshow", () => {
  dropdownMenu.value = "seleccionar";
  seleccionarGenero.value = "seleccionar";
  buscador.value = "";
  selectPlataforma.value = "seleccionar";
});
