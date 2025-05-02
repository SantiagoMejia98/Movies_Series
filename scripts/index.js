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

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
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

function getSizeInMB(str) {
  const bytes = new Blob([str]).size;
  return (bytes / (1024 * 1024)).toFixed(3); // Redondeado a 3 decimales
}

function medirPesos(data) {
  const compressed = localStorage.getItem(data);
  const jsonString = LZString.decompressFromUTF16(compressed);

  alert(
    "Tamaño JSON.stringify: " +
      getSizeInMB(jsonString) +
      " MB\n" +
      "Tamaño LZString.compressToUTF16: " +
      getSizeInMB(compressed) +
      " MB"
  );
}

async function cargarDatosGuardados() {
  const fecha = JSON.parse(localStorage.getItem("expirationDate"));

  if (fecha && new Date(fecha) > new Date()) {
    peliculas = JSON.parse(
      LZString.decompressFromUTF16(localStorage.getItem("peliculas"))
    );
    series = JSON.parse(
      LZString.decompressFromUTF16(localStorage.getItem("series"))
    );
    colecciones = JSON.parse(
      LZString.decompressFromUTF16(localStorage.getItem("colecciones"))
    );
    todasLasPeliculas = new Set(
      JSON.parse(
        LZString.decompressFromUTF16(localStorage.getItem("peliculasCard"))
      )
    );
    todasLasSeries = new Set(
      JSON.parse(
        LZString.decompressFromUTF16(localStorage.getItem("seriesCard"))
      )
    );
  } else {
    window.location = "actualizar.html";
  }
  medirPesos("peliculas");
  medirPesos("series");
  medirPesos("colecciones");
  medirPesos("peliculasCard");
  medirPesos("seriesCard");
  alert(
    `${Object.keys(peliculas).length} peliculas y ${
      Object.keys(series).length
    } series guardadas \n ${
      Object.keys(colecciones).length
    } colecciones guardadas \n ${
      todasLasPeliculas.size
    } peliculas en la lista de inicio \n ${
      todasLasSeries.size
    } series en la lista de inicio`
  );
}

await cargarDatosGuardados();

crearlistaInicio(elementos.peliculas, todasLasPeliculas);
crearlistaInicio(elementos.series, todasLasSeries);

dropdownMenu.addEventListener("change", manejarSeleccion);

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const type = card.getAttribute("data-type");
  const id = card.getAttribute("data-id");
  const aleatorio = { Tipo: type, Id: id };
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

  const peliculasFiltradas = Array.from(todasLasPeliculas).filter((p) =>
    p.Nombre.toLowerCase().includes(texto)
  );

  const seriesFiltradas = Array.from(todasLasSeries).filter((s) =>
    s.Nombre.toLowerCase().includes(texto)
  );

  crearlistaInicio(elementos.peliculas, peliculasFiltradas);
  crearlistaInicio(elementos.series, seriesFiltradas);
});
