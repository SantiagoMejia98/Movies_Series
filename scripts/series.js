const elementos = {
  series: document.querySelector('[data-name="series"]'),
};

const dropdownMenu = document.getElementById("dropdown-menu");

let todasLasSeries = new Set();
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
                    <h2 class="titulo"><strong>${pelicula.Nombre}</strong></h2>
                    <img src="https://image.tmdb.org/t/p/original${pelicula.Poster}" alt="${pelicula.Nombre}">
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
  const jsonString = JSON.stringify(data);
  const datos = LZString.compressToUTF16(jsonString);
  localStorage.setItem("datos", datos);
}

async function cargarDatosGuardados() {
  const compressedData = localStorage.getItem("datos");
  const jsonString = LZString.decompressFromUTF16(compressedData);
  data = JSON.parse(jsonString);
  todasLasSeries = new Set(data["seriesCard"]);
  crearlistaInicio(elementos.series, todasLasSeries);
}

await cargarDatosGuardados();

dropdownMenu.addEventListener("change", manejarSeleccion);

document.addEventListener("click", function (event) {
  const card = event.target.closest(".card");
  if (!card) return;

  const type = card.getAttribute("data-type");
  const id = card.getAttribute("data-id");
  data["aleatorio"] = { Tipo: type, Id: id };
  guardarDatos(data);
  if (type === "tv") {
    window.location.href = "serie.html";
  } else {
    window.location.href = "pelicula.html";
  }
});
