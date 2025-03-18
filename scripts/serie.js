const get = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMGUxNDBmYzcyNGQ1OTFjMzAwMWJlNDQ4NDg4MjcxMiIsIm5iZiI6MTcyNTQ3NzAyMS40NzcsInN1YiI6IjY2ZDhiMDlkM2E5NGE0OWMxNjI2ZjAzZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RdYktkxjOZERUNw2BaaX_ew5YAGVx2pJzAy5kHzi3RI",
  },
};

const dropdownMenu = document.getElementById("dropdown-menu");

const elementos = {
  serie: document.querySelector('[data-name="serie"]'),
};

let todasLasPeliculas = new Set();
let todasLasSeries = new Set();
let peliculas = {};
let series = {};
let colecciones = {};
let data = {};
let aleatorio;

async function cargarDatosGuardados() {
  const datos = localStorage.getItem("datos");
  data = JSON.parse(datos);
  series = data["series"];
  todasLasSeries = data["seriesCard"];
  aleatorio = data["aleatorio"];
  let titulo;
  if (!aleatorio) {
    aleatorio = seleccionarElementosAleatorios(todasLasSeries.length);
    titulo = todasLasSeries[aleatorio];
  } else {
    titulo = series[aleatorio.Id];
  }
  crearSerie(elementos.serie, titulo);
}

await cargarDatosGuardados();

function crearSerie(elemento, datos) {
  const containerExistente = elemento.querySelector(".container");

  if (containerExistente) {
    elemento.removeChild(containerExistente);
  }

  const container = document.createElement("div");
  container.className = "container";

  const content = document.createElement("div");
  content.className = "content";

  content.innerHTML = `
    <div class="background"
        style="background-image: url('https://image.tmdb.org/t/p/original${datos.Portada}');">
    </div>
    <div class="logo-container">
        <img class="logo" src="https://image.tmdb.org/t/p/w500${datos.Logo}" alt="${datos.Nombre}">
    </div>
  `;

  const moviecard = document.createElement("div");
  moviecard.className = "movie-card";

  moviecard.innerHTML = `
    <img class="poster" src="https://image.tmdb.org/t/p/w500${datos.Poster}" alt="${datos.Nombre}"> 
    `;

  const details = document.createElement("div");
  details.className = "details";

  details.innerHTML = `
    <h2>${datos.Nombre} (${datos.Lanzamiento})</h2>
    <p>${datos.Generos} &bull; ${datos.Duracion} &bull; ${datos.Status}</p>
    <p><i>${datos.Tagline}</i></p> 
    <ul>
      <li class="movie-item">
        <img src="https://image.tmdb.org/t/p/w92/pTnn5JwWr4p3pG8H6VrpiQo7Vs0.jpg">
        <p>Ver tráiler</p>
      </li>
    </ul>
    <div class="modal-content" id="trailerModal">
      <div class="close">&times;</div>
      <iframe class="trailer" id="trailerIframe"
        src="https://www.youtube.com/embed/${datos.Videos[0]}" frameborder="0" allowfullscreen>
      </iframe>
    </div>
    <h3>Sinopsis</h3>
    <p>${datos.Descripcion}</p>`;

  const proveedores = document.createElement("div");
  proveedores.className = "streaming-providers";

  proveedores.innerHTML = `
    <h3>Streaming on</h3>
  `;

  if (datos.Proveedores === "No disponible") {
    proveedores.innerHTML += `
      <p>${datos.Proveedores}</p>
    `;
  } else {
    const ulProvider = document.createElement("ul");
    ulProvider.className = "providers-list";

    datos.Proveedores.forEach((proveedor) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w92${proveedor.logo_path}" alt="${proveedor.provider_name}">
      `;

      ulProvider.appendChild(li);
    });
    proveedores.appendChild(ulProvider);
  }

  details.appendChild(proveedores);
  moviecard.appendChild(details);

  const cardcast = document.createElement("div");
  cardcast.className = "card-cast";

  const director = document.createElement("div");
  director.className = "reparto";

  director.innerHTML = `<h3>Director</h3>`;

  const ulDirector = document.createElement("ul");
  ulDirector.className = "director-list";

  datos.Directores.forEach((director) => {
    const li = document.createElement("li");
    li.className = "director";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w185${director.Foto}" alt="${director.Nombre}">
        <p class="director-name">${director.Nombre}</p>
        `;

    ulDirector.appendChild(li);
  });

  director.appendChild(ulDirector);
  cardcast.appendChild(director);

  const cast = document.createElement("div");
  cast.className = "reparto";

  cast.innerHTML = `<h3>Reparto</h3>`;

  const ulCast = document.createElement("ul");
  ulCast.className = "cast-list";

  datos.Reparto.forEach((actor) => {
    const li = document.createElement("li");
    li.className = "actor";

    li.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w185${actor.Foto}" alt="${director.Nombre}">
        <p class="actor-name">${actor.Nombre}</p>
        <p>${actor.Personaje}</p>
        `;

    ulCast.appendChild(li);
  });

  cast.appendChild(ulCast);
  cardcast.appendChild(cast);
  moviecard.appendChild(cardcast);
  content.appendChild(moviecard);

  const coleccion = document.createElement("div");
  coleccion.className = "coleccion";
  coleccion.innerHTML = `<h2>Temporadas</h2>`;
  const ulSeason = document.createElement("ul");
  ulSeason.className = "lista";
  datos.Temporadas.forEach((temporada) => {
    const li = document.createElement("li");
    li.className = "card";

    li.innerHTML = `
      <div class="pelicula-container">
        <h2><strong>${temporada.Nombre} (${temporada.Lanzamiento})</strong></h2>
        <img src="https://image.tmdb.org/t/p/w500${temporada.Poster}" alt="${temporada.Nombre}">
        <p>${temporada.Duracion}</p>
      </div>
      `;

    ulSeason.appendChild(li);
  });

  coleccion.appendChild(ulSeason);
  content.appendChild(coleccion);
  container.appendChild(content);
  elemento.appendChild(container);

  const movieItem = document.querySelector(".movie-item");
  movieItem.addEventListener("click", function () {
    openTrailer();
  });
  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", closeTrailer);
}

function seleccionarElementosAleatorios(tamaño) {
  return Math.floor(Math.random() * tamaño);
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

dropdownMenu.addEventListener("change", manejarSeleccion);

document.querySelectorAll(".bookmark-item").forEach((item) => {
  item.addEventListener("click", function () {
    const icon = this.querySelector("i");

    // Alternar entre icono vacío y relleno
    if (icon.classList.contains("fa-regular")) {
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid");
    } else {
      icon.classList.remove("fa-solid");
      icon.classList.add("fa-regular");
    }

    // Alternar la clase "filled" para cambiar el color
    this.classList.toggle("filled");
  });
});

function openTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "block";
}

// Función para cerrar el modal
function closeTrailer() {
  const modal = document.getElementById("trailerModal");
  modal.style.display = "none";
}
